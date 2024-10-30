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
 
import {AbstractRibbonButton, BigRibbonSelectButton, ILabelAndIcon, RibbonSelectButton} from "../index";
import upload, {IUploadShapeSettings} from "../../../../upload";
import {init} from "../../../../../../../di/src";

export class BigFileUploadButton extends AbstractRibbonButton{

    tag = "div";
    attr;

    icon: any;
    label: any;
    readMode: IUploadShapeSettings['readMode'];

    get child(){
        const self = this;
        return upload({
            onUpload(text){
                self.onUpload(text);
            },
            label: this.label,
            icon: this.icon,
            readMode: this.readMode
        });
    }

    onUpload(text: string){

    }

    getClass(){
        return "big-button file-button "+this.classPrefix+"button-hover-highlight "+super.getClass();
    }

}

export interface ILocalFileLabelAndIcon extends ILabelAndIcon{
    readMode?: IUploadShapeSettings['readMode'];
}


export class BigFileUploadSelectType extends RibbonSelectButton {

    items: ILocalFileLabelAndIcon[] = [];

    getContent(){
        const self = this;
        var res = {
            tag: "div",
            attr: {
                class: "select-list"
            },
            get child(){
                return self.items.map(item => {
                    return upload({
                        label: item.label,
                        readMode: item.readMode,
                        onUpload(data){
                            self.action(data, item);
                        }
                    })
                });
            }
        }
        return res;
    }

    action(data: any, settings: ILocalFileLabelAndIcon){

    }

    @init
    init(){
        super.init();
        this.selectPopup.closeOn = "down-outside";
    }

}
