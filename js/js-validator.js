class JSValidator{

    constructor (formId){
        this.setForm(formId);
        this.setInputs();
        this.parseInputs();
        
    }
    
    
    setForm(formId){
        this.form =document.getElementById(formId);
    }

    //  Refenecia a los inputs, seleccionamos todos
    setInputs (){
        this.inputs = document.querySelectorAll(`#${this.form.id} .jsValidator`);
    }

    //Analizar cada input, procesar inputs del formulario, loop ápara recorrer inputs
    parseInputs(){

        this.inputs.forEach(input => {
            this.appendErrorsTag(input);
        });
    }

    //Metodo adjuntar un error
    appendErrorsTag (input){

        //Identifica la etiqueta pade
        let parent = input.parentNode;

        let span = document.createElement('span');
        span.setAttribute("class", "error-msg");

        parent.appendChild(span);
    }

    //Escucha al evevnto submit
    validateForm(){
        this.form.addEventListener('submit', (e)=>{
            e.preventDefault();
            this.inputs.forEach(input =>{
                console.log ('Input validado');
            });
        });
    }
}