class JSValidator{

    status = true;

    errors = [];

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
        //Añadir escucha al formulario
        this.form.addEventListener('submit', (e)=>{

            //Reiniciar los errores y cambiar status a true
            this.resetValidation();

            //Recorrer cada input
            this.inputs.forEach(input =>{
                //Validar cada input
                this.validateInput(input);
            });
            if(!this.status){

                //Prevenir el envio del formulario
                e.preventDefault();

                console.log("ERROR: Ha ocurrido un error de validación");
            } else{
                //Fines de prueba
                e.preventDefault();
                console.log("ÉXITO: El formulario se ha enviado")
            }

        });
    }

    validateInputs(){
        this.inputs.forEach( input =>{
            input.addEventListener('input', (e) =>{
                this.resetValidation();
                this.validateInput(input);
            });
        });
    }

    validateInput (input) {

		let validators = input.dataset.validators;

		if (validators !== undefined) {

			validators = validators.split(' ');

			validators.forEach( validator => {

				/*
					Si el validador es required =>  su método de validación sería: _required(input)
					Si el validador es length =>  su método de validación sería: _length(input)
		
				*/

				this[`_${validator}`](input);

			});

		}

	}

    setError(input, msg){
        //Cambiando el valor de status
        this.status = false;
        this.setStackError(input, msg);
        this.setErrorMessage(input, msg);
         
    }

    setStackError (input, msg){
         //Añadir el error a nuestro stack de errores
         this.errors.push({input: input, msg : msg});
    }

    setErrorMessage(input, msg){
        //Adjuntando el error
          //Captura el elemento que esta despues del input , en este caso el span
          let span = input.nextElementSibling;
  
          // += para que se concatene y no se sobreescriba
          span.innerHTML += (msg + '<br />');
    }

    resetValidation(){
        this.status = true;  
        this.resetStackError();
        this.resetErrorMessages();
    }

    resetStackError(){
        //Pila de errores
        this.errors = [];
    }

    resetErrorMessages (){
        //Quitar mensajes de error
        let spans = document.querySelectorAll(`#${this.form.id} .error-msg`);

        spans.forEach( span => {
            span.innerHTML = "";
        });
    }

    init(){
        this.validateForm();
        this.validateInputs();
        return this;

    }


}


//Cambiar el valor del status a false, mostrar el error
JSValidator.prototype._required = function(input) {	
    
    let value =  input.value;
    let msg = 'Este campo es requerido';

    if(value.trim() == "" || value.length < 1){
        this.setError(input, msg);
    }
};

JSValidator.prototype._length = function(input){


}