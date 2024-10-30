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
 
import {getIconShape, IconSet} from "../../../icon";
import {BigRibbonSelectButton, RibbonSelectButton} from "../blocks";
import {RibbonContentSection} from "../base";
import {create, init, inject} from "../../../../../../di";
import {Editor} from "../../index";
import {ITableChange} from "../../../../collection2d/array2d";
import {TooltipBlock} from "../blocks/tooltip";
import {BigFileUploadSelectType} from "../blocks/input/file";
import axios from 'axios';
import {LabelSelectListItem, SelectList} from "../../../list/select";

declare var wp;
declare var jQuery;
declare var Papa;
declare var XLSX: any;

export class ImportDataButton extends RibbonSelectButton{

    label = ["media"]
    icon = getIconShape(IconSet.admin_media)

    @inject
    editor: Editor;

    getContent(){
        var list = new SelectList();
        list.items.push(new LabelSelectListItem("CSV").setAction(ev => {
            this.selectFile("csv");
        }));
        list.items.push(new LabelSelectListItem("Excel").setAction(ev => {
            this.selectFile("xslx");
        }));
        return list;
    }

    private selectFile(type){
        var image_frame;
        if(image_frame){
            image_frame.open();
        }
        // Define image_frame as wp.media object
        image_frame = wp.media({
            title: 'Select File',
            multiple : false,
            library : {

            }
        });
        const self = this;

        image_frame.on('close',function() {
            var selection =  image_frame.state().get('selection');
            selection.each(function(attachement){
                const url = attachement.attributes.url;

                return axios.get(url, {
                    responseType: type === 'xslx' ? 'arraybuffer' : null
                })
                .then(resp => {
                    self.changeData([{
                        value: parseExternalData(type, resp.data),
                        type: "load"
                    }])
                }, error => {
                    if (axios.isCancel(error)){
                        return null;
                    }
                    else if (error.response && error.response.status < 300 && error.response.status >= 200) {
                        alert(error.response.data);
                    } else if (!error.request) {
                        alert("No response from server");
                    } else {
                        alert(error.message);
                    }
                });
            });
        });

        image_frame.open();
    }

    @init
    init(){
        super.init();
        this.tooltip = new TooltipBlock({title: "Import data wordpress", content: {
            tag: 'html',
            child: `
    <p>Use the wordpress media library to import data into the table.</p>
            <ul class="bullet">
<li><b>CSV: </b>Import a comma separated file.</li>
<li><b>Excel: </b>Import an excel file or any of the xslx supported file formats.</li>
</ul>`
            }})
    }

    protected changeData(change: ITableChange<any>[]){
        this.editor.settings.dataset.changeableSourceTable.change(change);
    }

    additionalTooltip = "";

}

export function parseExternalData(type: "csv" | "xslx", data){
    if (type === "xslx"){
        var arrayBuffer = data;
        var byteArray = new Uint8Array(arrayBuffer);
        var workbook = XLSX.read(byteArray, {type: 'array'});
        if (workbook.SheetNames.length > 0) {
            var sheet = workbook.Sheets[workbook.SheetNames[0]];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            return Papa.parse(csv).data;
        }
        else {
            return [];
        }
    }
    else{
        return Papa.parse(data.trim()).data
    }
}

export class ImportLocalFileSeriesData extends BigFileUploadSelectType {

    label = ["local"]
    icon = getIconShape(IconSet.download2)

    @inject
    editor: Editor

    constructor(){
        super();
        var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||<any>{}).readAsBinaryString;
        this.items = [{label: "CSV", value: "csv"},{label: "Excel", value: "xslx", readMode: rABS ? "binary" : "array"}];
        this.tooltip = new TooltipBlock({title: "Import local file", content: {
            tag: 'html',
                child: `
Import a file from your local disk. You can choose following file types:
<ul class="bullet">
<li><b>CSV: </b>Import a comma separated file.</li>
<li><b>Excel: </b>Import an excel file or any of the xslx supported file formats.</li>
</ul>
                `
        }})
    }

    protected changeData(change: ITableChange<any>[]){
        this.editor.settings.dataset.changeableSourceTable.change(change);
    }

    action(data, settings){
        try{
            if (settings.value === "xslx"){
                if (!settings.readMode) data = new Uint8Array(data);
                var workbook = XLSX.read(data, {type: settings.readMode ? 'binary' : 'array'});
                if (workbook.SheetNames.length > 0) {
                    var sheet = workbook.Sheets[workbook.SheetNames[0]];
                    const csv = XLSX.utils.sheet_to_csv(sheet);
                    var tab = Papa.parse(csv).data;
                    this.changeData([{
                        value: tab,
                        type: "load"
                    }]);
                }
            }
            else {
                this.changeData([{
                    value: Papa.parse(data.trim()).data,
                    type: "load"

                }]);
            }
        }finally{
            this.selectPopup.popup && this.selectPopup.popup.forceClose();
        }
    }

}

export class ImportSection extends RibbonContentSection{

    label = "import";

    @create(() => new ImportDataButton())
    import: ImportDataButton;

    @create(() => new ImportLocalFileSeriesData())
    local: ImportLocalFileSeriesData;

    get contents(){
        return [this.tripleSurface({
            top: this.import,
            middle: this.local
        })];
    }

}
