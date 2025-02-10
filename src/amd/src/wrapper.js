// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * @module      tiny_recitautolink/plugin
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */
import {get_string as getString} from 'core/str';
import {getCourseId} from './options';
import Modal from 'core/modal';
import ModalEvents from 'core/modal_events';

export class Editor {
    appReact = null;
    modal = null;

    async open(editor) {
        this.editor = editor;
        let url = M.cfg.wwwroot;
        let js = url + "/lib/editor/tiny/plugins/recitautolink/react/build/index.js";
        let that = this;

        this.modal = await Modal.create({
            title: getString('pluginname', 'tiny_recitautolink'),
            body: '<div id="recitautolink_container"></div>'
        });

        this.modal.setRemoveOnClose(true);
        this.modal.getModal().addClass('modal-xl');

        this.modal.getRoot().on(ModalEvents.hidden, () => {
            that.unmountUI();
            that.modal.destroy();  
        });

        this.modal.show();

        if (!document.getElementById('recitautolink')) {
            var script = document.createElement('script');
            script.onload = this.loadUI.bind(this); 
            script.setAttribute('src', js); 
            script.setAttribute('id', 'recitautolink');
            script.setAttribute('type', 'text/javascript');
            document.getElementsByTagName('head')[0].appendChild(script);
        } else {
            this.loadUI();
        }
    }

    /**
     * Get template context.
     *
     * @param {TinyMCE} editor
     * @returns {Object}
     */
    getTemplateContext(editor) {
        return {
            elementid: editor.id
        };
    }

    get() {
        return getCourseId(this.editor);
    }

    unmountUI() {
        if (this.appReact) {
            this.appReact.unmount();
        }
    }

    loadUI() {
        if (window.openRecitAutolinkUI) {
            let classHandler = {
                get: (v) => this.get(v),
                close: (v) => this.closeUI(v)
            };
            this.appReact = window.openRecitAutolinkUI(classHandler);
        }
    }

    closeUI(code) {
        this.modal.destroy();  

        this.unmountUI();
        if (code) {
            this.editor.execCommand('mceInsertContent', false, code);
        }
    }
}