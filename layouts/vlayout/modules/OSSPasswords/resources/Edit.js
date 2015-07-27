/*+***********************************************************************************************************************************
 * The contents of this file are subject to the YetiForce Public License Version 1.1 (the "License"); you may not use this file except
 * in compliance with the License.
 * Software distributed under the License is distributed on an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied.
 * See the License for the specific language governing rights and limitations under the License.
 * The Original Code is YetiForce.
 * The Initial Developer of the Original Code is YetiForce. Portions created by YetiForce are Copyright (C) www.yetiforce.com. 
 * All Rights Reserved.
 *************************************************************************************************************************************/
Vtiger_Edit_Js("OSSPasswords_Edit_Js",{},{
	/**
	 * Function to register recordpresave event
	 */
	registerRecordPreSaveEvent : function(form){
		var thisInstance = this;
		if(typeof form == 'undefined') {
			form = this.getForm();
		}

		form.on(Vtiger_Edit_Js.recordPreSave, function(e, data) {
			var password = jQuery('[name="password"]').val();
			var id = jQuery('[name="record"]').val();
			if(password == '**********'){
				var params = {};
				params.data = {
					'module' : "OSSPasswords",
					'action' : "GetPass",
					'record' : id
				}
				params.async = false;

				AppConnector.request(params).then(
					function(data) {
						var response = data['result'];
						if (response['success']) {
							var el = document.getElementById( "OSSPasswords_editView_fieldName_password" );
							el.value = response['password'];
							el.onchange();
						}
					},
					function(data,err){
					
					}
				);
						
				// validate password
				passwordStrength('', '');
			
			}
			password = jQuery('[name="password"]').val();
			var params = {}
			params.data = { module: 'OSSPasswords', action: 'CheckPass', 'password': password , 'id': id}
			params.async = false;
			params.dataType = 'json';
			
			AppConnector.request(params).then(
				function(data) {
					if ( data.result.success == false ) {
						var params = {
							text: data.result.message,
							sticker: false,
							sticker_hover: false,
							type: 'error'
						};
						Vtiger_Helper_Js.showPnotify(params);
						send = false;
					}
					else {
						send = true;
						form.submit();
					}
				},
				function(data,err){
					send = false;
				}
			);
			
			if ( send == false )
				return false;
		})
	},
	
	registerBasicEvents : function(container){
		this._super(container);
		this.registerRecordPreSaveEvent(container);
	}
})