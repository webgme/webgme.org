// DO NOT EDIT THIS FILE
// This file is automatically generated from the webgme-setup-tool.
'use strict';


var config = require('webgme/config/config.default'),
    validateConfig = require('webgme/config/validator');


// The paths can be loaded from the webgme-setup.json
config.plugin.basePaths.push('node_modules/logic-gates/src/plugins');
config.plugin.basePaths.push('node_modules/petri-net/src/plugins');
config.plugin.basePaths.push('node_modules/finite-state-machine/src/plugins');
config.plugin.basePaths.push('node_modules/formula/src/plugins');
config.plugin.basePaths.push('node_modules/sysml/src/plugins');
config.plugin.basePaths.push('node_modules/power/src/plugins');
config.visualization.decoratorPaths.push('node_modules/petri-net/src/decorators');
config.visualization.decoratorPaths.push('node_modules/logic-gates/src/decorators');
config.visualization.decoratorPaths.push('node_modules/business-process-modeling/src/decorators');
config.visualization.decoratorPaths.push('node_modules/sysml/src/decorators');
config.visualization.decoratorPaths.push('node_modules/finite-state-machine/src/decorators');
config.visualization.decoratorPaths.push('node_modules/ui-components/src/decorators');
config.seedProjects.basePaths.push('node_modules/logic-gates/src/seeds/LogicGates');
config.seedProjects.basePaths.push('node_modules/petri-net/src/seeds/PetriNet');
config.seedProjects.basePaths.push('node_modules/finite-state-machine/src/seeds/FiniteStateMachine');
config.seedProjects.basePaths.push('node_modules/business-process-modeling/src/seeds/BusinessProcessModeling');
config.seedProjects.basePaths.push('node_modules/sysml/src/seeds/SysML');
config.seedProjects.basePaths.push('node_modules/power/src/seeds/Power');



config.visualization.panelPaths.push('node_modules/formula/src/visualizers/panels');


// Visualizer descriptors
config.visualization.visualizerDescriptors.push('./src/visualizers/Visualizers.json');
// Add requirejs paths
config.requirejsPaths = {
  'DisplayMetaDecorator': 'node_modules/ui-components/src/decorators/DisplayMetaDecorator',
  'FormulaEditor': 'panels/FormulaEditor/FormulaEditorPanel',
  'UMLStateMachineDecorator': 'node_modules/finite-state-machine/src/decorators/UMLStateMachineDecorator',
  'SysMLDecorator': 'node_modules/sysml/src/decorators/SysMLDecorator',
  'BusinessProcessModelingDecorator': 'node_modules/business-process-modeling/src/decorators/BusinessProcessModelingDecorator',
  'LogicGatesDecorator': 'node_modules/logic-gates/src/decorators/LogicGatesDecorator',
  'PetriNetDecorator': 'node_modules/petri-net/src/decorators/PetriNetDecorator',
  'Power': 'node_modules/power/src/seeds/Power',
  'SysML': 'node_modules/sysml/src/seeds/SysML',
  'BusinessProcessModeling': 'node_modules/business-process-modeling/src/seeds/BusinessProcessModeling',
  'FiniteStateMachine': 'node_modules/finite-state-machine/src/seeds/FiniteStateMachine',
  'PetriNet': 'node_modules/petri-net/src/seeds/PetriNet',
  'LogicGates': 'node_modules/logic-gates/src/seeds/LogicGates',
  'CheckFORMULA': 'node_modules/formula/src/plugins/CheckFORMULA',
  'OpenDSS_Generator': 'node_modules/power/src/plugins/OpenDSS_Generator',
  'SysMLImporter': 'node_modules/sysml/src/plugins/SysMLImporter',
  'SysMLExporter': 'node_modules/sysml/src/plugins/SysMLExporter',
  'Export2FORMULA': 'node_modules/formula/src/plugins/Export2FORMULA',
  'FSMImporter': 'node_modules/finite-state-machine/src/plugins/FSMImporter',
  'FSMCodeGenerator': 'node_modules/finite-state-machine/src/plugins/FSMCodeGenerator',
  'PetriNetExporter': 'node_modules/petri-net/src/plugins/PetriNetExporter',
  'LogicGatesExporter': 'node_modules/logic-gates/src/plugins/LogicGatesExporter',
  'panels': './src/visualizers/panels',
  'widgets': './src/visualizers/widgets',
  'panels/FormulaEditor': './node_modules/formula/src/visualizers/panels/FormulaEditor',
  'widgets/FormulaEditor': './node_modules/formula/src/visualizers/widgets/FormulaEditor'
};


config.mongo.uri = 'mongodb://127.0.0.1:27017/editor';
validateConfig(config);
module.exports = config;
