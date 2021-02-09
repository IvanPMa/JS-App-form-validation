class JSValidator{

    status = true;

    errors = [];

    via = 'http';

    validators = {
        minLength: 3,
        maxLength: 255,
    }

    msg ={
        required: `Este campo es requerido.`,
        minLength: `Longitud no válida. Minimo __minLength__ carcateres`,
        maxLength: `Longitud no válida. Máximo __maxLength__ carcateres`,
        email: `El campo de email no es válido`,

    }

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

    setAjax(){
        this.via = 'ajax';
        return this;
    }

    setHttp(){
        this.via = 'http';
        return this;
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
                //Evaluar si se debe enviar por ajax o http
                if(this.via == 'ajax'){
                    e.preventDefault();
                    this.submitHandler();
                } else{
                    // Solo para fines demostrativos
                    e.preventDefault();

                    console.log('Se ha enviado con el navegador');
                }
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
    submitHandler(){

        let data = new FormData(this.form);
        fetch(this.form.action, {
            method: this.form.method,
            body: data
        })
        .then(response => response.json())
        .then( data =>{
            console.log(data);
        })
        .catch(error =>{
            console.log(error);
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


    if(input.value.trim() == "" || input.value.length < 1){
        this.setError(input, this.msg.required);
    }
};

JSValidator.prototype._length = function(input){

    let value = input.value;
    let inputLength = value.length;


    let minLength = (input.dataset.validators_minlength !== undefined) ? Number(input.dataset.validators_minlength)
    : this.validators.minLength;

    let maxLength = (input.dataset.validators_maxlength !== undefined) ? Number(input.dataset.validators_maxlength)
    : this.validators.maxLength;

    let msg;
    if ( inputLength < minLength){
        msg = this.msg.minLength.replace('__minLength__', minLength);
        this.setError(input, msg);
    }

    if ( inputLength > maxLength){
        msg = this.msg.maxLength.replace('__maxLength__', maxLength);
        this.setError(input, msg);
    }
}

JSValidator.prototype._email = function (input){
    let value = input.value;
    let msg = this.msg.email;

    let pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);


    if (!pattern.test (value) && value.trim() != ""){
        this.setError(input, msg);
    }
}