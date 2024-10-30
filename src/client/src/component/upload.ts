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
 
import {html} from "../../../html";
import {IUpdateableTable, UpdateableTable} from "../collection2d/array2d";
import {getIconShape, IconSet} from "./icon";

declare var XLSX: any;

export class UploadShape implements html.IHtmlConfig{

    public tag: string;
    public attr: any = {
        type: "file",
        name: "files[]",
        placeholder: "Upload file",
        class: "custom-file-input height-0"
    }
    public event: any;
    public style = {
        display: "none"
    }

    constructor(public settings: IUploadShapeSettings){
        this.event = {
            change: (evt) => {
                this.onChange(evt);
            }
        }
    }

    public onChange(evt){
        uploadFile(evt, this);
    }
}

UploadShape.prototype.tag = "input";

function uploadFile(evt, model: UploadShape){
    var dateien = evt.target.files;
    var uploadDatei = dateien[0];
    var reader = new FileReader();
    reader.onload = function(theFileData: any) {
        var data =  theFileData.target.result;
        model.settings.onUpload(data);
    }
    switch(model.settings.readMode || "text"){
        case "binary":
            reader.readAsBinaryString(uploadDatei);
            break;
        case "array":
            reader.readAsArrayBuffer(uploadDatei);
            break;
        default:
            reader.readAsText(uploadDatei);
    }
    evt.target.value = "";
}

export interface IUploadShapeSettings{
    onUpload(text: any);
    readMode?: "text" | "binary" | "array";
    label: any;
    icon?: any;
}

var ids = 0;

export function tabularUpload(value: IUpdateableTable<any>) {
    var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||<any>{}).readAsBinaryString;
    return upload({
        readMode: rABS ? "binary" : "array",
        onUpload(data) {
            if (!rABS) data = new Uint8Array(data);
            var workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'});
            if (workbook.SheetNames.length > 0) {
                var sheet = workbook.Sheets[workbook.SheetNames[0]];
                const csv = XLSX.utils.sheet_to_csv(sheet);
                var tab = csv.split("\n").map(v => v.split(","));
                value.change([{
                    value: tab,
                    type: "load"
                }]);
            }
        },
        label: "Upload file"
    });
}

/*
<div class="custom-file mb-2" for="file2">
<input type="file" id="file2" class="custom-file-input height-0">
<span class="btn btn-primary"><i class="icon-upload-to-cloud">&nbsp;</i>Upload a file</span>
</div>
*/

export function upload(settings: IUploadShapeSettings){
    var us = new UploadShape(settings);
    var id = "upload_"+ids;
    us.attr.id = id;
    ids++;
    return {
        tag: "div",
        attr: {
            class: "custom-file"
        },
        child: [us, {
            tag: "label",
            attr: {
                for: id
            },
            child: [settings.icon || "", {tag: "div", attr: {class: "label"}, child: settings.label}]
        }]
    }
}

export namespace upload{
    export const tabular = tabularUpload;
}

export default upload;
