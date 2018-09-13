/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import TestPlanReduxHelper from "../utils/TestPlanReduxHelper";
import {connect} from "react-redux";
import {ListGroup, ListGroupItem, Panel, Row, Col, Popover, OverlayTrigger, Button, Table, Collapse} from 'react-bootstrap';
import {toggleVector, toggleFeature} from "../actions";
import AttributeGroup from "./AttributeGroup";

const ScenariodataRow = connect((state) => ({specifications: state.specifications.specs}))(({scenario}) => (
    <tr>
        <td>{scenario.scenarioName}</td>
        <td>{scenario.specName}</td>
        <td>{scenario.specSection}</td>
    </tr>
));

function makePop(feature){
    return (
        <Popover id="popover-positioned-bottom" placement="bottom" title="Scenario Details">
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th className={"tableHead"}>Scenario Name</th>
                        <th className={"tableHead"}>Spec Name</th>
                        <th className={"tableHead"}>Section</th>
                    </tr>
                </thead>
                <tbody className={"text-center"}>
                    {feature.scenarios.map((scenario) => <ScenariodataRow key={feature.uri.path} scenario={scenario}/>)}
                </tbody>
             </Table>
        </Popover>
    );
}

export const Feature = connect((state) => ({testvalues: state.testvalues}))(({feature, specName, dispatch, testvalues}) => (
    [
        <ListGroupItem>
            <div className="pull-right" onClick={() => {dispatch(toggleFeature(specName, feature.uri.path))}}>
                <i className={"fas fa-" + (TestPlanReduxHelper.getSelectedFeaturesFromState(testvalues, specName).includes(feature.uri.path) ? "check-square check-square-m" : "square fa-1x fa-square-list")}/>
            </div>
            Execute Test {feature.title}
        </ListGroupItem>,
        <div className={"attributes-well"}>
            <Collapse in={TestPlanReduxHelper.getSelectedFeaturesFromState(testvalues, specName).includes(feature.uri.path)}>
                <Panel.Body>
                    <Row>
                        <Col xs={8}>{feature.description}</Col>
                        <Col xs={4} className="specdetails">
                            <OverlayTrigger trigger="click" placement="bottom" className="s" overlay={makePop(feature)}>
                                <Button className="pull-right">Show scenarios</Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                    {feature.attributeGroups ? <hr/> : []}
                    {feature.attributeGroups ?
                        feature.attributeGroups.map(group => <AttributeGroup scope={"feature"} specName={specName} featureName={feature.uri.path} group={group} key={group.groupName}/>) : []}
                </Panel.Body>
            </Collapse>
        </div>
    ]
));

export const Vector = connect((state) => ({testvalues: state.testvalues}))(({testvalues, specName, vector, dispatch}) => (
    <ListGroupItem onClick={() => {
        dispatch(toggleVector(specName, vector.tag))
    }}>
        <div className="pull-right">
            <i className={"fas fa-" + (TestPlanReduxHelper.getSelectedVectorsFromState(testvalues, specName).includes(vector.tag) ? "check-square check-square-m" : "square fa-1x fa-square-list")}/>
        </div>
        <p>Test {vector.title}</p>
    </ListGroupItem>
));


export const Specification = ({spec,selectElement, selected}) => (
    <ListGroupItem key={"root-spec"} onClick={() => {selectElement(spec.name)}} active={selected}>
        <h4>{spec.title} {spec.version}</h4>
        <p>{spec.description}</p>
    </ListGroupItem>
);

export const SpecificationEditor = ({spec}) => (
    <div className={"test-configuration-view"}>
        <div>
            <h2>{spec.title} {spec.version} configuration</h2>
            <hr/>
        </div>
        <br/>
        <Panel>
            <Panel.Heading>Testing Vectors</Panel.Heading>
            <ListGroup>
                {spec.testingVectors.map((vector) => (<Vector vector={vector} specName={spec.name} key={vector.tag}/>))}
            </ListGroup>
        </Panel>
        <Panel>
            <Panel.Heading>Global Configuration</Panel.Heading>
            <Panel.Body id={"attributeGroups"}>
                {spec.attributeGroups.map((group) => <AttributeGroup scope={"specification"} specName={spec.name} group={group} key={group.groupName}/>)}
            </Panel.Body>
        </Panel>
        <br/>
        <Panel>
            <Panel.Heading>Testing Features</Panel.Heading>
            <ListGroup>
                {spec.features.map((feature) => <Feature key={feature.uri.path} feature={feature} specName={spec.name}/>)}
            </ListGroup>
        </Panel>
    </div>
)