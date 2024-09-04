'use strict';

var
	_ = require('underscore'),
	ko = require('knockout'),
	
	ModulesManager = require('%PathToCoreWebclientModule%/js/ModulesManager.js'),
	TextUtils = require('%PathToCoreWebclientModule%/js/utils/Text.js'),
	CAbstractSettingsFormView = ModulesManager.run('SettingsWebclient', 'getAbstractSettingsFormViewClass'),
	
	Settings = require('modules/%ModuleName%/js/Settings.js')
;


const FAKE_PASS = '******';

/**
 * Inherits from CAbstractSettingsFormView that has methods for showing and hiding settings tab,
 * updating settings values on the server, checking if there was changins on the settings page.
 * 
 * @constructor
 */
function CUserSettingsFormView()
{
	CAbstractSettingsFormView.call(this, Settings.ServerModuleName);

	this.sTabName = Settings.TabName || TextUtils.i18n('%MODULENAME%/LABEL_SETTINGS_TAB');
	this.login = ko.observable(Settings.Login);
	this.pass = ko.observable(Settings.HasPassword ? FAKE_PASS : '');
}

_.extendOwn(CUserSettingsFormView.prototype, CAbstractSettingsFormView.prototype);

/**
 * Name of template that will be bound to this JS-object.
 */
CUserSettingsFormView.prototype.ViewTemplate = '%ModuleName%_UserSettingsFormView';

/**
 * Returns array with all settings values wich is used for indicating if there were changes on the page.
 * 
 * @returns {Array} Array with all settings values;
 */
CUserSettingsFormView.prototype.getCurrentValues = function ()
{
	return [
		this.login(),
		this.pass()
	];
};

/**
 * Reverts all settings values to global ones.
 */
CUserSettingsFormView.prototype.revertGlobalValues = function ()
{
	this.login(Settings.Login);
	this.pass(Settings.HasPassword ? FAKE_PASS : '');
};

/**
 * Returns Object with parameters for passing to the server while settings updating.
 * 
 * @returns Object
 */
CUserSettingsFormView.prototype.getParametersForSave = function ()
{
	const parameters = {
		Login: this.login().trim()
	};
	if (this.pass() !== FAKE_PASS) {
		parameters.Password = this.pass().trim();
	}
	return parameters;
};

/**
 * Applies new settings values to global settings object.
 * 
 * @param {Object} oParameters Parameters with new values which were passed to the server.
 */
CUserSettingsFormView.prototype.applySavedValues = function (oParameters)
{
	Settings.update(oParameters.Login, true);
};

module.exports = new CUserSettingsFormView();
