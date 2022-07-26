let editor;
window.onload = function(){
  editor = ace.edit("editor");
  editor.setTheme("ace/theme/one_dark");
  editor.session.setMode("ace/mode/c_cpp");
  document.getElementById('editor').style.fontSize='20px';

  //change editor language mode on selection
  $('#language-menu').on('change',function(){
    if(this.value=='cpp' || this.value=='c')
      editor.session.setMode("ace/mode/c_cpp");
    else if(this.value=='java')
      editor.session.setMode("ace/mode/java");
    else if(this.value=='python')
      editor.session.setMode("ace/mode/python");  
    else
      editor.session.setMode("ace/mode/c_cpp");
  })

  //submitting code to server onclick submit button
  $('.submit-btn').on('click',function(){

    //disable submit button to disallow users for making simultaneous requests
    $('.submit-btn').attr('style','cursor:not-allowed;');
    $('.submit-btn').attr('disabled','true');

    //making request to compile and run
    $.ajax({
      url: 'https://yet-another-compiler.herokuapp.com/api',
      type: 'POST',
      data: {
        code: editor.getValue(),
        language: document.getElementById('language-menu').value,
        stdin : ''
      },
      success: function(response){
        output = '';
        if(response['api_status_code'] == 200 && response['api_message'] == 'Success'){
          if(response['stdout'].length>0){
            for(let i = 0;i < response['stdout'].length;i++){
              output += response['stdout'][i]+'<br/>';
            }
          }
          else{
            for(let i = 0;i < response['stderr'].length;i++){
              output += response['stderr'][i];
            }
          }
        }
        else{
          output = response['api_message'];
        }
        $('.output').html(output);
      },
      error: function(error){
        $('.output').html('Unknown Error');
      },
      complete: function(){
        //enable submit button again on response recieved
        $('.submit-btn').removeAttr('style');
        $('.submit-btn').removeAttr("disabled");
      }
    });    
  });
}