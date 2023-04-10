
var navigationItems=[
{"id":1,"name":"Products","href":"index.html"},
{"id":2,"name":"About us","href":"#"},
{"id":3,"name":"Author", "href":"#"},
{"id":4,"name":"Contact us", "href":"registration.html"},
{"id":5,"name":"My Cart","href":"#"}];

var registrationItems=[
{"id":1, "name":"firstName", "value":"First name"},
{"id":2, "name":"lastName","value":"Last name"},
{"id":3, "name":"email","value":"Email"}];

window.onload=function(){
		//SHOW NAVIGATION
		function showNavigation(){
			 let html='';
			for(let index in navigationItems){
				html+=`
					<div class="nav-items"><a href='${navigationItems[index].href}'>${navigationItems[index].name}</a></div>
				`;
			}
			document.querySelector('#navigation').innerHTML=html;
		}
		showNavigation();	
			
		//SHOW REGISTRATION
		function showRegistration(){
			let html=`<p> Send us your impressions </p><br/>`;
				console.log("pera");
			for(let index of registrationItems){
				
				html+=`<div class="text-tabs">
							<input type="text" class="validation" title="Write a message down bellow" id="${index.name}" placeholder="${index.value}"/>
							<p class="alert alert-danger mistake"><i>Value ${index.value} is not correct</i></p>
					</div>`;
			}
			html+=`<form>
					<div class="text-tabs">
					<textarea class="form-control" name="comment" rows="5" cols="40" id="comment" placeholder="Write a comment" maxlength="250"></textarea>
					<div id="counting">0/250</div>
				</div>
					<input type="button" id="btnSend" value="Send"/>
				</form>`;
			document.querySelector("#main").innerHTML=html;
			
}
console.log("hol");

showRegistration();
			
		//COUNTING CHARACTERS
		document.getElementById("comment").addEventListener("keyup", function () {
			document.querySelector("#counting").textContent = `${document.getElementById("comment").value.length}/250`;
		});

		//REGULAR EXPRESSION
		document.querySelector("#btnSend").addEventListener("click", function (e)
			{
				e.preventDefault()
				findErrors()
				console.log("it works");
			});

		function findErrors() {
		var wrong = [];
		let firstName, lastName, email, comments;
		firstName = document.querySelector("#firstName");
		lastName = document.querySelector("#lastName");
		email = document.querySelector("#email");
		comment = document.querySelector("#comment");
		console.log(firstName, lastName);

		let firstNameRegex = /^[A-ZĆČŽŠĐ][a-zčćžšđ]{2,14}$/;
		let lastNameRegex = /^[A-ZĆČŽŠĐ][a-zčćžšđ]{2,18}$/;  
		let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		let commentRegex = /.{2,200}/;
		let firstNameDone = false;
		let lastNameDone = false;
		let emailDone = false;
		let commentDone = false;


		function checkAll(itemValue, itemRegex, itemDone, type) {
			if (itemRegex.test(itemValue.value)) {
				itemDone = true;
				console.log(itemValue.value+" je dobar");
				if (itemValue.classList.contains("danger"))
					itemValue.classList.remove("danger");
					itemValue.nextElementSibling.classList.add("mistake");
			}
			else
			{
				wrong.push(type);
				itemDone = false;
				if (!itemValue.classList.contains("danger")){
					itemValue.classList.add("danger");
					itemValue.nextElementSibling.classList.remove("mistake");
					console.log("a");
				}
				console.log(wrong);
			}
			if(wrong.length==0){
				localStorage.setItem(type, itemValue.value);
				console.log(itemValue);
			}
		}
		
		checkAll(firstName, firstNameRegex, firstNameDone, "first name")
		checkAll(lastName, lastNameRegex, lastNameDone,"last name")
		checkAll(email, emailRegex, emailDone, "email")
		checkAll(comment, commentRegex, commentDone, "message")
	};



}