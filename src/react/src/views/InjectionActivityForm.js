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
 * This atto plugin allows to generate code for filter autolink and integrate them to your text.
 *
 * @package    tiny_recitautolink
 * @copyright  2019 RECIT
 * @license    {@link http://www.gnu.org/licenses/gpl-3.0.html} GNU GPL v3 or later
 */
import React, { Component } from 'react';
import {Button, Form, ButtonGroup, } from 'react-bootstrap';
import { ComboBoxPlus } from '../libs/components/ComboBoxPlus';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { GeneratorCode, HelpButton } from './common';

export class InjectionActivityForm extends Component {
    static defaultProps = {
        cmList: [],
        onClose: null
    };

    constructor(props) {
        super(props);
        
        this.onChange = this.onChange.bind(this);
        this.onInsert = this.onInsert.bind(this);

        this.state = {
            data: { ...GeneratorCode.injectionActivityData }
        };
    }

    componentWillUnmount(){
        this.setState({data: { ...GeneratorCode.injectionActivityData }});
    }

    render() {  
        let cmListFiltered = this.props.cmList.filter((item) => {
            return (item.label.search(/\[page\]/g) >= 0)
        });

        let main = 
        <Form>
            <Form.Group className="mb-3" controlId={"iteminjectionactivity1"}>
                <Form.Label className='d-flex align-items-center'>
                    <span className='mr-1'>{M.util.get_string('activity', 'tiny_recitautolink')}</span>
                    <HelpButton icon={faInfoCircle} helpText={<span>{M.util.get_string('injectionresources', 'tiny_recitautolink')}</span>}/>
                </Form.Label>
                <ComboBoxPlus options={cmListFiltered} name='activity' onChange={this.onChange} value={this.state.data.activity}/>
            </Form.Group>

            <Form.Group controlId={"iteminjectionactivity3"}>
                <div className="d-flex align-items-center">
                    <Form.Check  className="m-1" id={`openinginjection1`} inline type='radio' label={M.util.get_string('sametab', 'tiny_recitautolink')} name='opening' onChange={this.onChange} value='sametab'/>
                </div>
                <div className="d-flex align-items-center">
                    <Form.Check  className="m-1" id={`openinginjection2`} inline type='radio' label={M.util.get_string('newtab', 'tiny_recitautolink')} name='opening' onChange={this.onChange} value='newtab'/>
                </div>
                <div className="d-flex align-items-center">
                    <Form.Check  className="m-1" id={`openinginjection3`} inline type='radio' label={M.util.get_string('modal', 'tiny_recitautolink')} name='opening' onChange={this.onChange} value='modal'/>
                </div>
                <div className="d-flex align-items-center">
                    <Form.Check  className="m-1" id={`openinginjection4`} inline type='radio' label={M.util.get_string('modal16x9', 'tiny_recitautolink')} name='opening' onChange={this.onChange} value='modal16x9'/>
                </div>
            </Form.Group>

            <Form.Group ><hr/></Form.Group>

            <Form.Group controlId={"iteminjectionactivity4"}>
                <div className='d-flex align-items-center'>
                    <Form.Check className="m-1" id='injectionactivitybtn' inline type='checkbox' label={M.util.get_string('border', 'tiny_recitautolink')} name='activitybtn' onChange={this.onChange} value='border rounded p-2'/>
                    <HelpButton helpText={<>
                            <span>{M.util.get_string('infobs', 'tiny_recitautolink')}</span>
                            <br/>
                            <a href="https://getbootstrap.com/docs/4.6/utilities/borders/#border-radius" target="_blank">{M.util.get_string('btnshape', 'tiny_recitautolink')} <i className='p-1 fa fa-info-circle'></i> </a>
                            </>}
                        />
                </div> 
            </Form.Group>  
            <Form.Group className="mb-3" controlId={"iteminjectionactivity5"}>
                <Form.Label>{M.util.get_string('cssclass', 'tiny_recitautolink')}</Form.Label>
                <Form.Control type="text" name='activitycss' onChange={this.onChange} value={this.state.data.activitycss}/>
            </Form.Group> 

            <Form.Group ><hr/></Form.Group>

            <ButtonGroup className='d-flex'>
                <Button variant="secondary" onClick={() => this.props.onClose(null)}>{M.util.get_string('cancel', 'tiny_recitautolink')}</Button>
                <Button onClick={this.onInsert}>{M.util.get_string('insert', 'tiny_recitautolink')}</Button>
            </ButtonGroup>  
        </Form>;
        

        return (main);
    }

    onChange(e){
        let data = this.state.data;

        let value = e.target.value;
        if((e.target.type == 'checkbox') || (e.target.type == 'radio')){
            value = (e.target.checked ? e.target.value : '');
        }        
        
        data[e.target.name] = value;

        if((e.target.name === 'activitybtn')){
            data.activitycss = data[e.target.name];
        }
        
        this.setState({data: data});
    }

    onInsert(){
        let result = GeneratorCode.getInjectionActivityCode(this.state.data);
        
        if(result !== null){
            this.props.onClose(result);
        }
    }
}
