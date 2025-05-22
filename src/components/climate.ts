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

import { ComponentConfiguration } from '@/configuration/component_configuration';
import { MqttClient } from 'mqtt';
import { ComponentSettings } from '../api/settings';
import { Subscriber } from '../api/subscriber';

type StateTopicMap = {
  action_topic: string;
  current_humidity_topic: string;
  current_temperature_topic: string;
  fan_mode_state_topic: string;
  mode_state_topic: string;
  preset_mode_state_topic: string;
  swing_horizontal_mode_state_topic: string;
  swing_mode_state_topic: string;
  target_humidity_state_topic: string;
  temperature_high_state_topic: string;
  temperature_low_state_topic: string;
  temperature_state_topic: string;
};

type CommandTopicMap = {
  fan_mode_command_topic: string;
  mode_command_topic: string;
  power_command_topic: string;
  preset_mode_command_topic: string;
  swing_horizontal_mode_command_topic: string;
  swing_mode_command_topic: string;
  target_humidity_command_topic: string;
  temperature_command_topic: string;
  temperature_high_command_topic: string;
  temperature_low_command_topic: string;
};

/** Configuration interface for a climate component. */
export interface ClimateInfo extends ComponentConfiguration<'climate'> {
  action_template?: string;
  current_humidity_template?: string;
  current_temperature_template?: string;
  fan_mode_command_template?: string;
  fan_mode_state_template?: string;
  fan_modes?: string[];
  initial?: number;
  max_humidity?: number;
  max_temp?: number;
  min_humidity?: number;
  min_temp?: number;
  mode_command_template?: string;
  mode_state_template?: string;
  modes?: string[];
  optimistic?: boolean;
  payload_off?: string;
  payload_on?: string;
  power_command_template?: string;
  precision?: number;
  preset_mode_command_template?: string;
  preset_mode_value_template?: string;
  preset_modes?: string[];
  retain?: boolean;
  swing_horizontal_mode_command_template?: string;
  swing_horizontal_mode_state_template?: string;
  swing_horizontal_modes?: string[];
  swing_mode_command_template?: string;
  swing_mode_state_template?: string;
  swing_modes?: string[];
  target_humidity_command_template?: string;
  target_humidity_state_template?: string;
  temperature_command_template?: string;
  temperature_high_command_template?: string;
  temperature_high_state_template?: string;
  temperature_low_command_template?: string;
  temperature_low_state_template?: string;
  temperature_state_template?: string;
  temperature_unit?: string;
  temp_step?: number;
}

/**
 * Represents a thermostat in Home Assistant.
 *
 * @typeParam TUserData - Type of custom user data that can be passed to command callbacks
 */
export class Climate<TUserData> extends Subscriber<ClimateInfo, StateTopicMap, CommandTopicMap, TUserData> {
  /**
   * Creates a new climate instance
   *
   * @param settings - Configuration settings for the climate
   * @param commandCallback - Callback function to handle climate state changes
   * @param userData - Optional user data to be passed to the command callback
   */
  constructor(
    settings: ComponentSettings<ClimateInfo>,
    commandCallback: (client: MqttClient, topicName: string, message: string, userData?: TUserData) => Promise<void>,
    userData?: TUserData
  ) {
    super(
      settings,
      [
        'action_topic',
        'current_humidity_topic',
        'current_temperature_topic',
        'fan_mode_state_topic',
        'mode_state_topic',
        'preset_mode_state_topic',
        'swing_horizontal_mode_state_topic',
        'swing_mode_state_topic',
        'target_humidity_state_topic',
        'temperature_high_state_topic',
        'temperature_low_state_topic',
        'temperature_state_topic'
      ],
      [
        'fan_mode_command_topic',
        'mode_command_topic',
        'power_command_topic',
        'preset_mode_command_topic',
        'swing_horizontal_mode_command_topic',
        'swing_mode_command_topic',
        'target_humidity_command_topic',
        'temperature_command_topic',
        'temperature_high_command_topic',
        'temperature_low_command_topic'
      ],
      async (client: MqttClient, topicName: string, message: string, userData?: TUserData) => {
        await commandCallback(client, topicName, message, userData);
      },
      userData
    );
  }
}
