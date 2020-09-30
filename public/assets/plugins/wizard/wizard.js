// //== Class definition
// var WizardDemo = function () {
//     //== Base elements
//     var wizardEl = $('#m_wizard');
//     var formEl = $('#m_form');
//     var validator;
//     var wizard;
    
//     //== Private functions
//     var initWizard = function () {
//         //== Initialize form wizard
//         wizard = new mWizard('m_wizard', {
//             startStep: 1
//         });

//         //== Validation before going to next page
//         wizard.on('beforeNext', function(wizardObj) {
//             if (validator.form() !== true) {
//                 wizardObj.stop();  // don't go to the next step
//             }
//         })

//         //== Change event
//         wizard.on('change', function(wizard) {
//             mUtil.scrollTop();            
//         });

//         //== Change event
//         wizard.on('change', function(wizard) {
//             if (wizard.getStep() === 1) {
//                 alert(1);
//             }           
//         });
//     }

//     var initSubmit = function() {
//         var btn = formEl.find('[data-wizard-action="submit"]');

//         btn.on('click', function(e) {
//             e.preventDefault();

//             if (validator.form()) {
//                 //== See: src\js\framework\base\app.js
//                 mApp.progress(btn);
//                 //mApp.block(formEl); 

//                 //== See: http://malsup.com/jquery/form/#ajaxSubmit
//                 formEl.ajaxSubmit({
//                     success: function() {
//                         mApp.unprogress(btn);
//                         //mApp.unblock(formEl);

//                         swal({
//                             "title": "", 
//                             "text": "The application has been successfully submitted!", 
//                             "type": "success",
//                             "confirmButtonClass": "btn btn-secondary m-btn m-btn--wide"
//                         });
//                     }
//                 });
//             }
//         });
//     }

//     return {
//         // public functions
//         init: function() {
//             wizardEl = $('#m_wizard');
//             formEl = $('#m_form');

//             initWizard(); 
//             initValidation();
//             initSubmit();
//         }
//     };
// }();

jQuery(document).ready(function() {    
    WizardDemo.init();
});