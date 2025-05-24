/*
mqtt2ha
Copyright (C) 2025 Pascal Bourque

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { BinarySensor, Button, DeviceConfiguration, MqttSettings, Switch } from '@/.';
import { Climate } from '@/components/climate';
import { pino } from 'pino';

const rootLogger = pino({
  name: 'mqtt2ha',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: true,
      ignore: 'hostname,module',
      messageFormat: '\x1b[33m[{module}]\x1b[39m {msg}'
    }
  }
}).child({ module: 'example' });

/** Main function to run the example. */
async function main() {
  const mqttSettings: MqttSettings = {
    host: 'mosquitto.test-environment.orb.local',
    port: 1883,
    client_name: 'mqtt2ha'
  };

  const device: DeviceConfiguration = {
    name: 'MyDevice',
    manufacturer: 'MyManufacturer',
    model: 'MyModel',
    sw_version: '1.0.0',
    identifiers: 'my_device_id'
  };

  const myBinarySensor = new BinarySensor({
    mqtt: mqttSettings,
    component: {
      component: 'binary_sensor',
      name: 'MyBinarySensor',
      device_class: 'motion',
      unique_id: 'my_sensor_unique_id',
      device
    },
    logger: rootLogger.child({ module: 'binary_sensor' })
  });

  const myButton = new Button<never>(
    {
      mqtt: mqttSettings,
      component: {
        component: 'button',
        name: 'MyButton',
        unique_id: 'my_button_unique_id',
        device
      },
      logger: rootLogger.child({ module: 'button' })
    },
    async () => {
      rootLogger.info('Button pressed!');
      await myBinarySensor.toggle();
    }
  );

  const mySwitch = new Switch(
    {
      mqtt: mqttSettings,
      component: {
        component: 'switch',
        name: 'MySwitch',
        unique_id: 'my_switch_unique_id',
        device
      },
      logger: rootLogger.child({ module: 'switch' })
    },
    async () => {
      rootLogger.info('Switch toggled!');
    }
  );

  const myThermostat: DeviceConfiguration = {
    name: 'MyThermostat',
    manufacturer: 'MyManufacturer',
    model: 'MyModel',
    sw_version: '1.0.0',
    identifiers: 'my_thermostat_id'
  };

  const myClimate = new Climate(
    {
      mqtt: mqttSettings,
      component: {
        component: 'climate',
        name: 'MyClimate',
        unique_id: 'my_climate_unique_id',
        device: myThermostat
      },
      logger: rootLogger.child({ module: 'climate' })
    },
    ['mode_state_topic', 'current_temperature_topic', 'temperature_state_topic'],
    [
      'fan_mode_command_topic',
      'mode_command_topic',
      'power_command_topic',
      // 'preset_mode_command_topic',
      // 'swing_horizontal_mode_command_topic',
      // 'swing_mode_command_topic',
      // 'target_humidity_command_topic',
      'temperature_command_topic'
      // 'temperature_high_command_topic',
      // 'temperature_low_command_topic'
    ]
  );

  await myBinarySensor.writeConfig();
  await myButton.writeConfig();
  await mySwitch.writeConfig();
  await myClimate.writeConfig();

  myClimate.currentTemperature = 70;
  myClimate.targetTemperature = 68;
}

main().catch((error) => {
  rootLogger.error(error, 'Error:');
});
