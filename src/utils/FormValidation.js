
export function minLengthValidation( inputData, minLength ){
    removeClassErrorSucess(inputData);
    const { value } = inputData;
    
    if(value.length >= minLength){
      return true;
    } else{
      return false;
    }
  }
  
  export function emailValidation(inputData){
    const emailValid = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const { value } = inputData;
  
    removeClassErrorSucess(inputData);
    const resultValidation = emailValid.test(value);
    if(resultValidation){
      inputData.classList.add("success");
      return true;
    } else {
      inputData.classList.add("error");
      return false;
    }
  }
  
  function removeClassErrorSucess(inputData){
    inputData.classList.remove("success");
    inputData.classList.remove("error");
  }