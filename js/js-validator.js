class JSValidator{

    constructor (formId){
        this.setForm(formId);
        
    }
    
    
    setForm(formId){
        this.form =document.getElementById(formId);
    }


}