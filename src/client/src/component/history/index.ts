/**
 * Chartplot lets you create charts am embed them into your websites. See chartplot.com/wordpress for more information.
 *
 * Copyright 2016-2019 Christoph Rodak <christoph@rodak.li>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>
 *
 */
 
import {node, transaction} from "../../../../reactive";
import stream from "../../../../reactive/src/event";
import variable from "../../../../reactive/src/variable";

export class ChartHistory{

    public commands: ChartCommand[] = [];
    public commandIndex = -1;
    public $r = node();
    onExecuted = stream<IHistoryCommand>();
    public r_isExecuting = variable(false);
    public maxNrOfItems = 100;
    private executingCommand: ChartCommand;
    public r_stateIndex = variable(0);
    private executeNumber: number = 0;
    private startIndex = 0;

    get stateIndex(){
        return this.r_stateIndex.value;
    }

    set stateIndex(v){
        this.r_stateIndex.value = v;
    }

    get isExecuting(){
        return this.r_isExecuting.value;
    }

    set isExecuting(v){
        this.r_isExecuting.value = v;
    }

    canUndo(): boolean{
        this.$r.observed();
        return this.commandIndex >= 0;
    }

    canDo(): boolean{
        this.$r.observed();
        return this.commandIndex < this.commands.length - 1;
    }

    do(){
        if (this.canDo()){
            this.commandIndex++;
            const comm = this.commands[this.commandIndex];
            comm.do();
            this.stateIndex = comm.stateIndex;
            this.$r.changedDirty();
        }
        this.$r.changed();
    }

    undo(){
        if (this.canUndo()){
            let comm = this.commands[this.commandIndex];
            comm.undo();
            this.commandIndex--;
            comm = this.commands[this.commandIndex];
            if (comm){
                this.stateIndex = comm.stateIndex;
            }
            else
            {
                this.stateIndex = this.startIndex;
            }
            this.$r.changedDirty();
        }
        this.$r.changed();
    }

    executeCommand(command: IHistoryCommand){
        if (this.isExecuting){
            this.executingCommand.execute(command);
            return;
        }
        this.isExecuting = true;
        this.executeNumber++;
        this.executingCommand = new ChartCommand(command, this.executeNumber);
        this.commands = this.commands.slice(0, this.commandIndex+1);
        this.commands.push(this.executingCommand);
        this.do();
        this.onExecuted.fire(this.executingCommand);
        this.isExecuting = false;
        this.executingCommand = null;
        if (this.commands.length > this.maxNrOfItems){
            this.startIndex = this.commands[0].stateIndex;
            this.commands.splice(0, 1);
            this.commandIndex = this.commands.length - 1;
        }
    }

    commandFailed(){
        if (this.isExecuting){
            this.commands.pop();
            this.executeNumber--;
            this.commandIndex--;
        }
    }

}

export interface IHistoryCommand{

    do();
    undo();

}

class ChartCommand implements IHistoryCommand{

    public additionalCommands: IHistoryCommand[] = [];

    constructor(public command: IHistoryCommand, public stateIndex: number){

    }

    do(){
        this.command.do();
        this.additionalCommands.forEach(ac => ac.do());
    }

    undo(){
        this.additionalCommands.slice().reverse().forEach(ac => ac.undo());
        this.command.undo();
    }

    execute(command: IHistoryCommand){
        this.additionalCommands.push(command);
    }



}

export class HistoryCommandGroup implements IHistoryCommand{

    constructor(public commands: IHistoryCommand[]){

    }

    do(){
        transaction(() => {
            this.commands.forEach(c => c.do());
        });
    }

    undo(){
        transaction(() => {
            this.commands.reverse().forEach(c => c.undo());
        });
    }

}
