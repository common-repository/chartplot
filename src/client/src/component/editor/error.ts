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
 
import {array} from "../../../../reactive";
import {getIconShape, IconSet} from "../icon";

export interface IEditorProblem {

    type: "error" | "warning";
    message: any;

}

export class EditorProblems {

    tag = "div";

    attr = {
        class: "problems"
    }

    problems = array<IEditorProblem>();

    get child(){
        const self = this;
        return {
            tag: "ul",
            attr: {
                class: "list-group"
            },
            get child(){
                return self.problems.values.map(problem => {
                    return {
                        tag: "li",
                        attr: {
                            class: "list-group-item"
                        },
                        child: [getIconShape(IconSet.notification), {
                            tag: "div",
                            attr: {
                                class: "content"
                            },
                            child: problem.message
                        }]
                    }
                });
            }
        }
    }

    clear(){
        this.problems.clear();
    }

    provideProblem(problem: IEditorProblem) {
        this.problems.push(problem);
    }

}
