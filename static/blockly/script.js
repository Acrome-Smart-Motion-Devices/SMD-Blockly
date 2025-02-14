// Blockly block definitions
// Define Master block
const Define_Master = {
  init: function() {
      this.appendDummyInput()
          .appendField('Define Master')
          .appendField(new Blockly.FieldDropdown([
              ['Select Baudrate', 'Select Baudrate'],
              ['9600', '9600'],
              ['57600', '57600'],
              ['115200', '115200'],
              ['921600', '921600'],
              ['1115200', '1115200'],
              ['3000000', '3000000'],
          ]), 'baudrate');
      this.setNextStatement(true, null);
      this.setTooltip('This block defines the master device and initializes it with a selected baudrate.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.common.defineBlocks({Define_Master: Define_Master});

python.pythonGenerator.forBlock['Define_Master'] = function(block) {
  const baudrate = this.getFieldValue('baudrate');
  const code = 
      "from smd.red import *\n" +
      "import math\n"+
      "import os\n\n" +
      "from serial.tools.list_ports import comports\n" +
      "from platform import system\n" +
      "def USB_Port():\n" +
      "    if system() == 'Windows':\n" +
      "        ports = list(comports())\n" +
      "        if ports:\n" +
      "            for port, desc, hwid in sorted(ports):\n" +
      "                if 'USB Serial Port' in desc:\n" +
      "                    SMD_Port = port\n" +
      "                    return SMD_Port\n\n" +
      "    elif system() == 'Linux':\n" +
      "        ports = list(serial.tools.list_ports.comports())\n" +
      "        if ports:\n" +
      "            for port, desc, hwid in sorted(ports):\n" +
      "                if '/dev/ttyUSB' in port:\n" +
      "                    SMD_Port = port\n" +
      "                    return SMD_Port\n\n" +
      "    elif system() == 'Darwin':  # macOS\n" +
      "        ports = list(serial.tools.list_ports.comports())\n" +
      "        if ports:\n" +
      "            for port, desc, hwid in sorted(ports):\n" +
      "                if '/dev/tty.usbserial' in port or '/dev/tty.usbmodem' in port:\n" +
      "                    SMD_Port = port\n" +
      "                    return SMD_Port\n\n" +
      "    else:\n" +
      "        SMD_Port = None\n" +
      "        return SMD_Port\n\n"+
      "port=USB_Port()\n"+
      "m = Master(port,"+"baudrate="+baudrate+")\n";
  return code;
};

const Smd_Red = {
  init: function() {
    this.appendDummyInput('Print')
      .appendField('Smd Red');
    this.appendValueInput('Red ID')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('Red ID');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('This block attaches the SMD Red device with a specified Red ID.');
    this.setHelpUrl('');
    this.setColour(225);
  }
};
Blockly.common.defineBlocks({Smd_Red: Smd_Red});
python.pythonGenerator.forBlock['Smd_Red'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const code = "m.attach(Red("+red_id+"))\n\n";
  return code;
}  

const Set_CPR = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('Set CPR')
      .appendField(new Blockly.FieldNumber(6533), 'CPR');
    this.appendValueInput('Red ID')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('Red ID');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('This block sets the CPR (Counts Per Revolution) for a specified Red ID.');
    this.setHelpUrl('');
    this.setColour(225);
  }
};
Blockly.common.defineBlocks({Set_CPR: Set_CPR});
python.pythonGenerator.forBlock['Set_CPR'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const number_cpr = this.getFieldValue('CPR');

  const code = 'm.set_shaft_cpr('+red_id+',' + number_cpr + ')\n';
  return code;
}  

const Set_RPM = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('Set RPM')
      .appendField(new Blockly.FieldNumber(100), 'RPM');
    this.appendValueInput('Red ID')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('Red ID');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('This block sets the RPM (Revolutions Per Minute) for a specified Red ID.');
    this.setHelpUrl('');
    this.setColour(225);
  }
};
Blockly.common.defineBlocks({Set_RPM: Set_RPM});
python.pythonGenerator.forBlock['Set_RPM'] = function(block) {
  const number_rpm = this.getFieldValue('RPM');
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  // TODO: Assemble python into the code variable.
  const code = 'm.set_shaft_rpm('+red_id+',' + number_rpm + ')\n';
  return code;
}  

// Set Operation Mode block
const Set_Operation_Mode = {
  init: function() {
      this.appendDummyInput()
          .appendField('Set Operation Mode')
          .appendField(new Blockly.FieldDropdown([
              ['PWM', 'PWM'],
              ['Position', 'Position'],
              ['Velocity', 'Velocity'],
              ['Torque', 'Torque']
          ]), 'MODE');
      this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block sets the operation mode for a specified Red ID.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};

Blockly.Blocks['Set_Operation_Mode'] = Set_Operation_Mode;

python.pythonGenerator.forBlock['Set_Operation_Mode'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const mode = this.getFieldValue('MODE');
  const code = 
  'm.set_operation_mode('+red_id+', OperationMode.' + mode + ')\n';
  return code;
};

// Initialize Motor block
const initialize_motor = {
  init: function() {
      this.appendDummyInput().appendField('Define Motor');
      this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block initializes the motor with default parameters.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.Blocks['initialize_motor'] = initialize_motor;

python.pythonGenerator.forBlock['initialize_motor'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const code = 
      "motor_speed = 0\n" +
      "angle_degrees=0"+"\n" +
      "current_limit = 100"+"\n" +
      "current_value = 0"+"\n" +
      "previous_current = 0"+"\n" +
      "m.set_operation_mode("+red_id+", OperationMode.Velocity)\n" +
      "m.set_control_parameters_velocity("+red_id+", 30.0, 5.0, 0.0)\n" +
      "m.set_control_parameters_position("+red_id+", 0.5, 0.0, 20.0)\n" +
      "m.set_control_parameters_torque("+red_id+", 3.0, 0.1, 0.0)\n" +
      "m.enable_torque("+red_id+", True)\n\n";
  return code;
};

const GetJoystickValues = {
  init: function() {
      this.appendDummyInput()
          .appendField('Get Joystick Values');
      this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.appendValueInput('Module ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Module ID');
      this.appendValueInput('X_VAR')
          .setCheck('Variable')
          .appendField('X axis');
      this.appendValueInput('Y_VAR')
          .setCheck('Variable')
          .appendField('Y axis');
      this.appendValueInput('BUTTON_VAR')
          .setCheck('Variable')
          .appendField('Button');
      this.setColour(225);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block retrieves joystick X, Y, and button values.');
      this.setHelpUrl('');
  }
};
Blockly.common.defineBlocks({GetJoystickValues: GetJoystickValues});


python.pythonGenerator.forBlock['GetJoystickValues'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const ID = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || '1';
  const xVar = python.pythonGenerator.valueToCode(block, 'X_VAR', python.Order.ATOMIC) || '_';
  const yVar = python.pythonGenerator.valueToCode(block, 'Y_VAR', python.Order.ATOMIC) || '_';
  const buttonVar = python.pythonGenerator.valueToCode(block, 'BUTTON_VAR', python.Order.ATOMIC) || '_';

  const code = `${xVar}, ${yVar}, ${buttonVar} = m.get_joystick(${red_id}, ${ID})\n`;
  return code;
};

const Start_Mode_PWM = {
init: function() {
    this.appendDummyInput()
        .appendField('Start Mode PWM with Duty Cycle')
        .appendField(new Blockly.FieldNumber(0, -100, 100), 'PWM')
        .appendField('%');
    this.appendValueInput('Red ID')
        .setCheck(['Variable', 'Number'])
        .appendField('Red ID');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('This block sets the motor PWM to a specific duty cycle.');
    this.setHelpUrl('');
    this.setColour(225);
}
};
Blockly.common.defineBlocks({ Start_Mode_PWM: Start_Mode_PWM });
python.pythonGenerator.forBlock['Start_Mode_PWM'] = function(block) {
// PWM alanından değer alınır
const motor_speed = block.getFieldValue('PWM');
const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';

// Python kodu üretilir
const code = 
    'motor_speed = ' + motor_speed + '\n' +
    'm.set_duty_cycle(' + red_id + ', -motor_speed)\n\n';
return code;
};


const Start_Mode_PWM_Joystick = {
  init: function() {
      this.appendDummyInput().appendField('Start Mode PWM');
      this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.appendValueInput('X_VALUE')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('motor speed (X)');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block starts the motor in PWM mode with joystick control.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.common.defineBlocks({Start_Mode_PWM_Joystick: Start_Mode_PWM_Joystick});


python.pythonGenerator.forBlock['Start_Mode_PWM_Joystick'] = function(block) {
  const xValue = python.pythonGenerator.valueToCode(block, 'X_VALUE', python.Order.ATOMIC);
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const code = 
      `motor_speed = ${xValue}\n` +
      'm.set_duty_cycle('+red_id+', -motor_speed)\n\n';
  return code;
};


const Start_Mode_Position = {
  init: function() {
      this.appendDummyInput()
          .appendField('Start Mode Position With Angle')
          .appendField(new Blockly.FieldNumber(0, 0, 360), 'ANGLE')
          .appendField('degrees');
      this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block sets the motor position to a specific angle.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.common.defineBlocks({ Start_Mode_Position: Start_Mode_Position });

// Python code generation
python.pythonGenerator.forBlock['Start_Mode_Position'] = function(block) {
  // Get the angle input from the Blockly field
  const angle_degrees = block.getFieldValue('ANGLE');
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  // Generate Python code to set motor position based on the angle
  const code = 
  'position = ('+angle_degrees+'* 6533) / 360\n'+
  'm.set_position('+red_id+', position)\n\n';
  return code;
};
const Start_Mode_Velocity = {
  init: function() {
      this.appendDummyInput()
          .appendField('Start Mode Velocity with Speed')
          .appendField(new Blockly.FieldNumber(0, -100, 100), 'SPEED')
          .appendField('units');
      this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block sets the motor velocity to a specified value.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.common.defineBlocks({ Start_Mode_Velocity: Start_Mode_Velocity });

// Python code generation
python.pythonGenerator.forBlock['Start_Mode_Velocity'] = function(block) {
  // Get the speed input from the Blockly field
  const motor_speed = block.getFieldValue('SPEED');
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const code = 
  'm.set_velocity('+red_id+', -' + motor_speed + ')\n\n';
  return code;
};
const Start_Mode_Position_Joystick = {
  init: function() {
      this.appendDummyInput()
          .appendField('Start Mode Position');
      this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.appendValueInput('X_VALUE')
          .setCheck('Variable')
          .appendField('X value');
      this.appendValueInput('Y_VALUE')
          .setCheck('Variable')
          .appendField('Y value');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block sets the motor position based on joystick values.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.common.defineBlocks({ Start_Mode_Position_Joystick: Start_Mode_Position_Joystick });

// Python code generation
python.pythonGenerator.forBlock['Start_Mode_Position_Joystick'] = function(block) { 
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0'; 
  const xValue = python.pythonGenerator.valueToCode(block, 'X_VALUE', python.Order.ATOMIC);
  const yValue = python.pythonGenerator.valueToCode(block, 'Y_VALUE', python.Order.ATOMIC);
  
  const code = 
      `if (-10 < ${xValue} < 10) and (-10 < ${yValue} < 10):\n` +
      '    try:\n' +
      '        current_position = m.get_position('+red_id+')\n' +
      '        angle_degrees = current_position * (360/6533)\n\n' +
      '    except:\n' +
      '        current_position = 0\n' +
      '        previous_angle = 0\n\n' +
      'else:\n' +
      `    a = ${xValue} / 100.0\n` +
      `    b = ${yValue} / 100.0\n` +           
      '    angle = math.atan2(b, a)\n' +
      '    previous_angle = angle_degrees\n' +
      '    angle_degrees = (math.degrees(angle) + 360) % 360\n' +
      '    if angle_degrees - previous_angle > 180:\n' +
      '       angle_degrees -= 360\n' +
      '    position = angle_degrees * (6533/360)\n' +
      '    m.set_position('+red_id+', position)\n\n';
  
  return code;
};

const Start_Mode_Velocity_Joystick = {
  init: function() {
      this.appendDummyInput()
          .appendField('Start Mode Velocity');
      this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.appendValueInput('X_VALUE')
          .setCheck('Variable')
          .appendField('X value');
      this.appendValueInput('Y_VALUE')
          .setCheck('Variable')
          .appendField('Y value');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block sets the motor velocity based on joystick input.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.common.defineBlocks({ Start_Mode_Velocity_Joystick: Start_Mode_Velocity_Joystick });

python.pythonGenerator.forBlock['Start_Mode_Velocity_Joystick'] = function(block) { 
  const xValue = python.pythonGenerator.valueToCode(block, 'X_VALUE', python.Order.ATOMIC);
  const yValue = python.pythonGenerator.valueToCode(block, 'Y_VALUE', python.Order.ATOMIC);
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const code = 
      `if (${xValue} > 50 or ${yValue} > 50) and motor_speed < 100:\n` +
      '    motor_speed += 1\n\n' +
      `elif (${xValue} < -50 or ${yValue} < -50) and motor_speed > -100:\n` +
      '    motor_speed -= 1\n\n' +
      'm.set_velocity('+red_id+', -motor_speed)\n';
  
  return code;
};

const Start_Mode_Torque_Joystick = {
  init: function() {
      this.appendDummyInput()
          .appendField('Start Mode Torque');
      this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.appendValueInput('X_VALUE')
          .setCheck('Variable')
          .appendField('Joystick X');
      this.appendValueInput('Y_VALUE')
          .setCheck('Variable')
          .appendField('Joystick Y');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block sets the motor torque based on joystick input.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.common.defineBlocks({ Start_Mode_Torque_Joystick: Start_Mode_Torque_Joystick });
python.pythonGenerator.forBlock['Start_Mode_Torque_Joystick'] = function(block) { 
  const xValue = python.pythonGenerator.valueToCode(block, 'X_VALUE', python.Order.ATOMIC);
  const yValue = python.pythonGenerator.valueToCode(block, 'Y_VALUE', python.Order.ATOMIC);
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const code = 
      `if ${xValue} > 50 or ${yValue} > 50:\n` +
      `    current_limit += 1\n\n` +
      `elif ${xValue} < -50 or ${yValue} < -50:\n` +
      `    current_limit -= 1\n\n` +
      `m.set_torque(${red_id}, current_limit - 50)\n\n` +
      `try:\n` +
      `    previous_current = current_value\n` +
      `    current_value = m.get_torque(${red_id})\n` +
      `except:\n` +
      `    current_value = previous_current\n\n` +
      `if current_value >= current_limit:\n` +
      `    current_value = current_limit\n`;

  return code;
};


const Start_Mode_Torque = {
  init: function() {
      this.appendDummyInput()
          .appendField('Start Mode Torque')
          .appendField(new Blockly.FieldNumber(0, -100, 100), 'CURRENT_LIMIT')
          .appendField('Current Limit');
          this.appendValueInput('Red ID')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Red ID');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block sets the motor torque.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.common.defineBlocks({ Start_Mode_Torque: Start_Mode_Torque });
python.pythonGenerator.forBlock['Start_Mode_Torque'] = function(block) {
  const CURRENT_LIMIT = block.getFieldValue('CURRENT_LIMIT');
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const code = 
  'm.set_torque('+red_id+', '+CURRENT_LIMIT+')\n\n';
  return code;
};

const Set_Rgb_Color = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('Set Rgb Color');
    this.appendValueInput('Red ID')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('Red ID');
    this.appendValueInput('Module ID')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('Module ID');
    this.appendValueInput('R')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('R');
    this.appendValueInput('G')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('G');
    this.appendValueInput('B')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('B');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('This block sets the RGB color.');
    this.setHelpUrl('');
    this.setColour(225);
  }
};

Blockly.common.defineBlocks({ Set_Rgb_Color: Set_Rgb_Color });
python.pythonGenerator.forBlock['Set_Rgb_Color'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const ID = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || '1';
  const value_r = python.pythonGenerator.valueToCode(block, 'R', python.Order.ATOMIC) || '0';
  const value_g = python.pythonGenerator.valueToCode(block, 'G', python.Order.ATOMIC) || '0';
  const value_b = python.pythonGenerator.valueToCode(block, 'B', python.Order.ATOMIC) || '0';
  const code = `m.set_rgb(${red_id}, ${ID}, ${value_r}, ${value_g}, ${value_b})\n`;
  return code;
};      

const Get_Button = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('Get Button Value');
    this.appendValueInput('Red ID')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('Red ID');
    this.appendValueInput('Module ID')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('Module ID');
    this.setOutput(true, null);
    this.setTooltip('This block retrieves the button value.');
    this.setHelpUrl('');
    this.setColour(225);
  }
};
Blockly.common.defineBlocks({Get_Button: Get_Button});
python.pythonGenerator.forBlock['Get_Button'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
  const ID = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || '1';
  const code = 'm.get_button('+red_id+','+ID+')\n';
  return [code, python.Order.NONE];
};  


const get_ambient_light = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('Get Ambient Light Value');
    this.appendValueInput('Red ID')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('Red ID');
    this.appendValueInput('Module ID')
      .setCheck('Variable')
      .setCheck('Number')
      .appendField('Module ID');
    this.setOutput(true, null);
    this.setTooltip('This block retrieves the ambient light value.');
    this.setHelpUrl('');
    this.setColour(225);
  }
};
Blockly.common.defineBlocks({get_ambient_light: get_ambient_light});
python.pythonGenerator.forBlock['get_ambient_light'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || "0";
  const value_module_id = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || "1";
  const code = 'm.get_light('+red_id+','+value_module_id+')\n';
  return [code, python.Order.NONE];
};

const Wait = {
  init: function() {
      this.appendDummyInput()
          .appendField('Wait');
      this.appendValueInput('Time')
          .setCheck('Variable')
          .setCheck('Number')
          .appendField('Time');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('This block pauses the program for a specified amount of time.');
      this.setHelpUrl('');
      this.setColour(225);
  }
};
Blockly.common.defineBlocks({ Wait: Wait });

// Python code generation
python.pythonGenerator.forBlock['Wait'] = function(block) {
  const sleep = python.pythonGenerator.valueToCode(block, 'Time', python.Order.ATOMIC) || "0";
  const code = 'time.sleep(' + String(sleep) + ')\n';
  return code;
};

const Ultrasonic_Distance_Sensor = {
  init: function() {
    this.appendDummyInput('Print')
      .appendField('Get Distance');
    this.appendValueInput('Red ID')
    .setCheck(['Variable', 'Number'])
      .appendField('Red ID');
    this.appendValueInput('Module ID')
    .setCheck(['Variable', 'Number'])
      .appendField('Module ID');
    this.setOutput(true, null);
    this.setTooltip('This block retrieves the distance from the ultrasonic sensor.');
    this.setHelpUrl('');
    this.setColour(225);
  }
};
Blockly.common.defineBlocks({Ultrasonic_Distance_Sensor: Ultrasonic_Distance_Sensor});
python.pythonGenerator.forBlock['Ultrasonic_Distance_Sensor'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || "0";
  const value_module_id = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || "1";
  const code = 'm.get_distance('+red_id+','+value_module_id+')\n';

  return [code, python.Order.NONE];
}  

const Set_Buzzer = {
  init: function() {
    this.appendDummyInput('Print')
      .appendField('Set Buzzer');
    this.appendValueInput('Red ID')
    .setCheck(['Variable', 'Number'])
      .appendField('Red ID');
    this.appendValueInput('Module ID')
    .setCheck(['Variable', 'Number'])
      .appendField('Module ID');
    this.appendValueInput('Frequency')
    .setCheck(['Variable', 'Number'])
      .appendField('Frequency');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('This block sets the buzzer frequency.');
    this.setHelpUrl('');
    this.setColour(225);
  }
};
Blockly.common.defineBlocks({Set_Buzzer: Set_Buzzer});
python.pythonGenerator.forBlock['Set_Buzzer'] = function(block) {
  const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || "0";
  const value_module_id = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || "1";
  const value_frequency = python.pythonGenerator.valueToCode(block, 'Frequency', python.Order.ATOMIC) || "0";

  // TODO: Assemble python into the code variable.
  const code = 'm.set_buzzer('+red_id+','+value_module_id+','+value_frequency+')\n';
  return code;
}   
// Initialize Blockly
function init() {
  const workspace = Blockly.inject('blocklyDiv', {
      toolbox: document.getElementById('toolbox'),
      trashcan: true,
      move: {
          scrollbars: true,
          drag: true,
          wheel: true
      }
  });
}

const Get_IMU = {
init: function() {
  this.appendDummyInput('Print')
    .appendField('Get IMU');
  this.appendValueInput('Red ID')
  .setCheck(['Variable', 'Number'])
    .appendField('Red ID');
  this.appendValueInput('Module ID')
  .setCheck(['Variable', 'Number'])
    .appendField('Module ID');
  this.appendValueInput('Pitch')
  .setCheck(['Variable'])
  .appendField('Pitch');
  this.appendValueInput('Roll')
  .setCheck(['Variable'])
  .appendField('Roll');
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip('This block retrieves the IMU data.');
  this.setHelpUrl('');
  this.setColour(225);
}
};
Blockly.common.defineBlocks({Get_IMU: Get_IMU});
python.pythonGenerator.forBlock['Get_IMU'] = function(block) {
const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || "0";
const value_module_id = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || "1";
const value_pitch = python.pythonGenerator.valueToCode(block, 'Pitch', python.Order.ATOMIC) || "_";
const value_roll = python.pythonGenerator.valueToCode(block, 'Roll', python.Order.ATOMIC) || "_";
const code = `${value_roll}, ${value_pitch} = m.get_imu(${red_id}, ${value_module_id})\n`;

return code;
}
const Get_POT = {
init: function() {
  this.appendDummyInput('Print')
    .appendField('Get Potentiometer');
  this.appendValueInput('Red ID')
  .setCheck(['Variable', 'Number'])
    .appendField('Red ID');
  this.appendValueInput('Module ID')
  .setCheck(['Variable', 'Number'])
    .appendField('Module ID');
  this.setOutput(true, null);
  this.setTooltip('This block retrieves the ADC conversion from the potentiometer module.');
  this.setHelpUrl('');
  this.setColour(225);
}
};

Blockly.common.defineBlocks({Get_POT: Get_POT});
python.pythonGenerator.forBlock['Get_POT'] = function(block) {
const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || "0";
const value_module_id = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || "1";
const code = `m.get_potentiometer(${red_id}, ${value_module_id})\n`;

return [code, python.Order.NONE];
}

const Set_Servo = {
init: function() {
  this.appendDummyInput('Print')
    .appendField('Set Servo Position');
  this.appendValueInput('Red ID')
  .setCheck(['Variable', 'Number'])
    .appendField('Red ID');
  this.appendValueInput('Module ID')
  .setCheck(['Variable', 'Number'])
    .appendField('Module ID');
  this.appendValueInput('Value')
  .setCheck(['Variable', 'Number'])
  .appendField('Value');
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip('This block sets the servo position with given module ID.');
  this.setHelpUrl('');
  this.setColour(225);
}
};

Blockly.common.defineBlocks({Set_Servo: Set_Servo});
python.pythonGenerator.forBlock['Set_Servo'] = function(block) {
const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || "0";
const value_module_id = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || "1";
const val = python.pythonGenerator.valueToCode(block, 'Value', python.Order.ATOMIC) || "0";
const code = `m.set_servo(${red_id}, ${value_module_id}, ${val})\n`;

return code;
};
const Get_Position = {
init: function() {
    this.appendDummyInput()
        .appendField('Get Motor Position');
    this.appendValueInput('Red ID')
        .setCheck('Variable')
        .setCheck('Number')
        .appendField('Red ID');
    this.appendValueInput('Position Variable')
        .setCheck('Variable')
        .appendField('Position');
    this.setColour(225);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Get Position of the Motor.');
    this.setHelpUrl('');
}
}
Blockly.common.defineBlocks({Get_Position: Get_Position});
python.pythonGenerator.forBlock['Get_Position'] = function(block) {
const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
const position = python.pythonGenerator.valueToCode(block, 'Position Variable', python.Order.ATOMIC) || NaN;
const code = `${position} = m.get_position(${red_id})\n`;
return code;
};

const Get_qtr = {
init: function() {
    this.appendDummyInput()
        .appendField('Get QTR Module Values');
    this.appendValueInput('Red ID')
        .setCheck('Variable')
        .setCheck('Number')
        .appendField('Red ID');
    this.appendValueInput('Module ID')
        .setCheck('Variable')
        .setCheck('Number')
        .appendField('Module ID');
    this.appendValueInput('Left_Var')
        .setCheck('Variable')
        .appendField('Left');
    this.appendValueInput('Middle_VAR')
        .setCheck('Variable')
        .appendField('Middle');
    this.appendValueInput('Right_VAR')
        .setCheck('Variable')
        .appendField('Right');
    this.setColour(225);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('This block retrieves the QTR module data with given module ID.');
    this.setHelpUrl('');
}
};
Blockly.common.defineBlocks({Get_qtr: Get_qtr});


python.pythonGenerator.forBlock['Get_qtr'] = function(block) {
const red_id = python.pythonGenerator.valueToCode(block, 'Red ID', python.Order.ATOMIC) || '0';
const ID = python.pythonGenerator.valueToCode(block, 'Module ID', python.Order.ATOMIC) || '1';
const Left_Var = python.pythonGenerator.valueToCode(block, 'Left_Var', python.Order.ATOMIC) || '_';
const Middle_VAR = python.pythonGenerator.valueToCode(block, 'Middle_VAR', python.Order.ATOMIC) || '_';
const Right_VAR = python.pythonGenerator.valueToCode(block, 'Right_VAR', python.Order.ATOMIC) || '_';

const code = `${Left_Var}, ${Middle_VAR}, ${Right_VAR} = m.get_qtr(${red_id}, ${ID})\n`;
return code;
};
// showCode fonksiyonunu güncelle
function showCode() {
// Python kodunu al
var code = Blockly.Python.workspaceToCode(Blockly.getMainWorkspace());

// Kod çıktısı için container oluştur
var codeContainer = document.getElementById('code');
codeContainer.innerHTML = `
    <div class="code-container">
        <div class="code-header">
            <span class="file-name">Python Code</span>
            <div class="code-actions">
                <button onclick="copyCode()">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button onclick="downloadPythonCode()">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
        <pre class="line-numbers"><code class="language-python">${escapeHtml(code)}</code></pre>
    </div>
`;

// Prism.js'i çalıştır
Prism.highlightAllUnder(codeContainer);

// Kodu çalıştır
fetch('/run_code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code })
})
.then(response => response.json())
.then(data => {
    if (data.error) {
        showNotification('error', data.error, data.details);
    }
})
.catch(error => {
    showNotification('error', 'Connection error', error.message);
});
}

// HTML karakterlerini escape et
function escapeHtml(unsafe) {
return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
// Prism.js'i başlat
Prism.highlightAll();
});

function showNotification(type, message, details = '') {
const notificationDiv = document.createElement('div');
notificationDiv.className = `notification ${type}`;

const notificationContent = document.createElement('div');
notificationContent.className = 'notification-content';

const header = document.createElement('div');
header.className = 'notification-header';

const icon = document.createElement('i');
icon.className = `fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}`;

const messageSpan = document.createElement('span');
messageSpan.textContent = message;

header.appendChild(icon);
header.appendChild(messageSpan);

if (details) {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-error-btn';
    copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Error';
    copyBtn.onclick = async () => {
        try {
            // Geçici bir textarea oluştur
            const textArea = document.createElement('textarea');
            textArea.value = details;
            document.body.appendChild(textArea);
            textArea.select();
            
            // Kopyalama işlemini dene
            await document.execCommand('copy');
            
            // Geçici textarea'yı kaldır
            document.body.removeChild(textArea);
            
            // Başarılı geri bildirim
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Error';
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };
    header.appendChild(copyBtn);
    
    const detailsPre = document.createElement('pre');
    detailsPre.className = 'notification-details';
    detailsPre.textContent = details;
    notificationContent.appendChild(detailsPre);
}

notificationContent.insertBefore(header, notificationContent.firstChild);
notificationDiv.appendChild(notificationContent);
document.body.appendChild(notificationDiv);

setTimeout(() => {
    notificationDiv.remove();
}, 5000);
}

function downloadBlocks() {
const xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
const xmlText = Blockly.Xml.domToText(xml);

// QWebChannel bağlantısını kur
new QWebChannel(qt.webChannelTransport, function(channel) {
    // Backend nesnesini al
    const backend = channel.objects.backend;  // "backend" olarak değiştirildi
    
    if (backend && typeof backend.saveBlocksToFile === "function") {
        backend.saveBlocksToFile(xmlText);
    } else {
      console.error("Backend connection failed or downloadBlocks function not found");
      alert("Save function is not supported or PyQt connection failed.");
    }
});
}


function loadBlocks(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
      try {
          const workspace = Blockly.getMainWorkspace();
          const xml = new DOMParser().parseFromString(e.target.result, "text/xml");
          workspace.clear();
          Blockly.Xml.domToWorkspace(xml.documentElement, workspace);
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred while uploading the file!');
      }
  };
  reader.readAsText(file);
}
window.onload = init;

function copyCode() {
try {
    const codeElement = document.getElementById('code');
    if (!codeElement) {
        console.error('Code element not found');
        return;
    }

    // Geçici bir textarea oluştur
    const textarea = document.createElement('textarea');
    textarea.value = codeElement.textContent;
    document.body.appendChild(textarea);
    
    // Metni seç ve kopyala
    textarea.select();
    document.execCommand('copy');
    
    // Geçici textarea'yı kaldır
    document.body.removeChild(textarea);

    // Başarılı bildirimi göster
    const btn = document.querySelector('.code-actions button');
    if (btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalContent;
        }, 2000);
    }
} catch (error) {
    console.error('Error in copyCode function:', error);
}
}

function downloadPythonCode() {
const code = document.getElementById('code').textContent;

// QWebChannel bağlantısını kur
new QWebChannel(qt.webChannelTransport, function(channel) {
    const backend = channel.objects.backend;
    
    if (backend && typeof backend.savePythonCode === "function") {
        backend.savePythonCode(code);
    } else {
      console.error("Backend connection failed or savePythonCode function not found");
      alert("Save function is not supported or PyQt connection failed.");
    }
});
}