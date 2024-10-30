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
 
import {IList, list} from '../../../core';
import node, {IReactiveNode} from '../node';
import procedure, {IProcedure} from '../procedure';

export class SingleDelayProcedureExecution{

    public proc: IProcedure;
    public delay = true;
    public canUpdate = false;
    public $r: IReactiveNode = node();

    constructor(handle: (p: IProcedure) => void){
        this.proc = procedure((p) => {
            if (this.delay){
                this.canUpdate = true;
                this.$r.changedDirty();
                return;
            }
            this.delay = true;
            handle(p);
        });
    }


    public update(){
        this.$r.observed();
        if (this.canUpdate){
            this.canUpdate = false;
            this.delay = false;
            this.proc.update();
        }
    }

    public cancel(){
        this.proc.cancel();
    }
}

export class DelayedProcedureExecution{

    public updates: IList<IProcedure> = list<IProcedure>();
    public $r = node();

    private add(p: IProcedure){
        this.updates.addLast(p);
        this.$r.changedDirty();
    }

    public update(){
        this.$r.observed();
        this.updates.forEach(p => {
            (<any>p)._delayed_update = true;
            p.update();
        });
        this.updates = list<IProcedure>();
    }

    public procedure(handle: (p: IProcedure) => void){
        return procedure((p: any) => {
            if (!p._delayed_update){
                this.add(p);
                return;
            }
            p._delayed_update = false;
            handle(p);
        });
    }

    public cancel(){
        this.updates = list();
    }

}
