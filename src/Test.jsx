import { useState } from 'react';
import { Col, Row, Slider } from 'antd';
const gutters = {};
const vgutters = {};
const colCounts = {};
[8, 16, 24, 32, 40, 48].forEach((value, i) => {
  gutters[i] = value;
});
[8, 16, 24, 32, 40, 48].forEach((value, i) => {
  vgutters[i] = value;
});
[2, 3, 4, 6, 8, 12].forEach((value, i) => {
  colCounts[i] = value;
});
const Test = () => {
  const [gutterKey, setGutterKey] = useState(1);
  const [vgutterKey, setVgutterKey] = useState(1);
  const [colCountKey, setColCountKey] = useState(2);
  const cols = [];
  const colCount = colCounts[colCountKey];
  for (let i = 0; i < colCount; i++) {
    cols.push(
      <Col key={i.toString()} span={24 / colCount}>
        <div>Column</div>
      </Col>,
    );
  }
  return (
    <>
      <span>Horizontal Gutter (px): </span>
      <div
        style={{
          width: '50%',
        }}
      >
        <Slider
          min={0}
          max={Object.keys(gutters).length - 1}
          value={gutterKey}
          onChange={setGutterKey}
          marks={gutters}
          step={null}
          tooltip={{
            formatter: (value) => gutters[value],
          }}
        />
      </div>
      <span>Vertical Gutter (px): </span>
      <div
        style={{
          width: '50%',
        }}
      >
        <Slider
          min={0}
          max={Object.keys(vgutters).length - 1}
          value={vgutterKey}
          onChange={setVgutterKey}
          marks={vgutters}
          step={null}
          tooltip={{
            formatter: (value) => vgutters[value],
          }}
        />
      </div>
      <span>Column Count:</span>
      <div
        style={{
          width: '50%',
          marginBottom: 48,
        }}
      >
        <Slider
          min={0}
          max={Object.keys(colCounts).length - 1}
          value={colCountKey}
          onChange={setColCountKey}
          marks={colCounts}
          step={null}
          tooltip={{
            formatter: (value) => colCounts[value],
          }}
        />
      </div>
      <Row gutter={[gutters[gutterKey], vgutters[vgutterKey]]}>
        {cols}
        {cols}
        {cols}
        {cols}
        {cols}
      </Row>
    </>
  );
};
export default Test;