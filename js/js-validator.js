class JSValidator{

    status = true;

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


            this.inputs.forEach(input =>{
    
                this.validateInput(input);
            });
            if(!this.status){

                //Prevenir el envio del formulario
                e.preventDefault();

                console.log("Ha ocurrido un error de validación");
            } else{
                console.log("El forulario se ha enviado")
            }

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


    init(){
        this.validateForm();
        return this;

    }


}

JSValidator.prototype._required = function(input) {	
 
    //Lógica de la validación
    let errors = false;

    if(errors){
        this.status = false;   
    }
};

JSValidator.prototype._length = function(input){


}