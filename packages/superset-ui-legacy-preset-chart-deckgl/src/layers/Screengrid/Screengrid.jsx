/* eslint-disable react/jsx-handler-names */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-magic-numbers */
/* eslint-disable sort-keys */
/* eslint-disable react/forbid-prop-types */
/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
/* eslint no-underscore-dangle: ["error", { "allow": ["", "__timestamp"] }] */

import React from 'react';
import PropTypes from 'prop-types';
import { ScreenGridLayer } from 'deck.gl';
import { t } from '@superset-ui/translation';
import AnimatableDeckGLContainer from '../../AnimatableDeckGLContainer';
import { getPlaySliderParams } from '../../utils/time';
import sandboxedEval from '../../utils/sandbox';
import { commonLayerProps } from '../common';
import TooltipRow from '../../TooltipRow';

function getPoints(data) {
  return data.map(d => d.position);
}

function setTooltipContent(o) {
  return (
    <div className="deckgl-tooltip">
      <TooltipRow label={`${t('Weight')}: `} value={`${o.object.weight}`} />
    </div>
  );
}

export function getLayer(formData, payload, onAddFilter, setTooltip, selected, onSelect, filters) {
  const fd = formData;
  const c = fd.color_picker;
  let data = payload.data.features.map(d => ({
    ...d,
    color: [c.r, c.g, c.b, 255 * c.a],
  }));

  if (fd.js_data_mutator) {
    // Applying user defined data mutator if defined
    const jsFnMutator = sandboxedEval(fd.js_data_mutator);
    data = jsFnMutator(data);
  }

  // eslint-disable-next-line no-eq-null
  if (filters != null) {
    filters.forEach(f => {
      data = data.filter(f);
    });
  }

  // Passing a layer creator function instead of a layer since the
  // layer needs to be regenerated at each render
  return new ScreenGridLayer({
    id: `screengrid-layer-${fd.slice_id}`,
    data,
    pickable: true,
    cellSizePixels: fd.grid_size,
    minColor: [c.r, c.g, c.b, 0],
    maxColor: [c.r, c.g, c.b, 255 * c.a],
    outline: false,
    getWeight: d => d.weight || 0,
    ...commonLayerProps(fd, setTooltip, setTooltipContent),
  });
}

const propTypes = {
  formData: PropTypes.object.isRequired,
  payload: PropTypes.object.isRequired,
  setControlValue: PropTypes.func.isRequired,
  onAddFilter: PropTypes.func,
  setTooltip: PropTypes.func,
};
const defaultProps = {
  onAddFilter() {},
  setTooltip() {},
};

class DeckGLScreenGrid extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = DeckGLScreenGrid.getDerivedStateFromProps(props);

    this.getLayers = this.getLayers.bind(this);
    this.onValuesChange = this.onValuesChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    // the state is computed only from the payload; if it hasn't changed, do
    // not recompute state since this would reset selections and/or the play
    // slider position due to changes in form controls
    if (state && props.payload.form_data === state.formData) {
      return null;
    }

    const features = props.payload.data.features || [];
    const timestamps = features.map(f => f.__timestamp);

    // the granularity has to be read from the payload form_data, not the
    // props formData which comes from the instantaneous controls state
    const granularity =
      props.payload.form_data.time_grain_sqla || props.payload.form_data.granularity || 'P1D';

    const { start, end, getStep, values, disabled } = getPlaySliderParams(timestamps, granularity);

    return {
      start,
      end,
      getStep,
      values,
      disabled,
      selected: [],
      lastClick: 0,
      formData: props.payload.form_data,
    };
  }

  onValuesChange(values) {
    this.setState({
      // eslint-disable-next-line react/no-access-state-in-setstate
      values: Array.isArray(values) ? values : [values, values + this.state.getStep(values)],
    });
  }

  getLayers(values) {
    const filters = [];

    // time filter
    if (values[0] === values[1] || values[1] === this.end) {
      filters.push(d => d.__timestamp >= values[0] && d.__timestamp <= values[1]);
    } else {
      filters.push(d => d.__timestamp >= values[0] && d.__timestamp < values[1]);
    }

    const layer = getLayer(
      this.props.formData,
      this.props.payload,
      this.props.onAddFilter,
      this.props.setTooltip,
      filters,
    );

    return [layer];
  }

  render() {
    const { formData, payload, setControlValue, width, height } = this.props;

    return (
      <div>
        <AnimatableDeckGLContainer
          initialViewState={this.props.initialViewState}
          getLayers={this.getLayers}
          start={this.state.start}
          end={this.state.end}
          getStep={this.state.getStep}
          values={this.state.values}
          onValuesChange={this.onValuesChange}
          disabled={this.state.disabled}
          mapboxApiAccessToken={payload.data.mapboxApiKey}
          mapStyle={formData.mapbox_style}
          setControlValue={setControlValue}
          width={width}
          height={height}
          aggregation
        />
      </div>
    );
  }
}

DeckGLScreenGrid.propTypes = propTypes;
DeckGLScreenGrid.defaultProps = defaultProps;

export default DeckGLScreenGrid;