const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeSensorReadings, formatLiveValue } = require('./liveTelemetry');

test('normalizes wrapped arrays from the backend', () => {
  const readings = normalizeSensorReadings({ data: [{ sensorType: 'temperature', value: 41.2, unit: '°C' }] }, 'tx-1');

  assert.equal(readings.length, 1);
  assert.equal(readings[0].sensorType, 'temperature');
  assert.equal(readings[0].value, 41.2);
  assert.equal(readings[0].transformerId, 'tx-1');
});

test('coerces object payloads from MQTT topics into sensor cards', () => {
  const readings = normalizeSensorReadings({ temperature: { value: 34.7, timestamp: '2026-01-01T00:00:00Z' } }, 'tx-2');

  assert.equal(readings.length, 1);
  assert.equal(readings[0].sensorType, 'temperature');
  assert.equal(readings[0].value, 34.7);
  assert.equal(readings[0].unit, '°C');
});

test('accepts scalar readings emitted directly from hardware payloads', () => {
  const readings = normalizeSensorReadings({ transformerId: 'tx-3', temperature: 41.2, current: 3.1 }, 'tx-3');

  assert.equal(readings.length, 2);
  assert.deepEqual(readings.map(({ sensorType, value }) => ({ sensorType, value })), [
    { sensorType: 'temperature', value: 41.2 },
    { sensorType: 'current', value: 3.1 },
  ]);
});

test('formats a value with the right unit label', () => {
  assert.equal(formatLiveValue({ value: 21, unit: '°C' }), '21.0 °C');
  assert.equal(formatLiveValue({ value: 'offline' }), 'offline');
});
