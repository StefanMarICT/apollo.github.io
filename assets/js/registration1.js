
var navigationItems=["Products","About us", "Author", "Contact us", "My Cart"];
var navigationLinks=["index.html", "#","#","registration.html","#"];

		//SHOW NAVIGATION
		function showNavigation(){
			 let html='';
			for(let index in navigationItems){
			
				html+=`
					<div class="nav-items"><a href='${navigationLinks[index]}'>$navigationItems{[index].name}</a></div>
				`;
			}
			$('#navigation').html(html);
			
			
		}
		
		//SHOW REGISTRATION
		/*function showRegistration(items){
			let html=`<p> Send us your impressions </p><br/>`;
				console.log("pera");
			for(let index in items){
				html+=`<div class="text-tabs">
							<input type="${items[index].value}" class="validation" title="Write a message down bellow" id="${items[index].name}" placeholder="${items[index].site}"/>
							<h3 class="value">Value ${items[index].site} is not correct</h3>
					</div>`;
			}
			html+=`<form>
					<div class="text-tabs">
					<textarea class="form-control" name="comment" rows="5" cols="40" id="comment" placeholder="Write a comment" maxlength="250">
					</textarea>
					<div id="counting">0/250</div>
				</div>
					<input type="button" id="btnSend" value="Send"/>
				</form>`;
			document.querySelector("#main").innerHTML=html;
			
}

			
		//COUNTING CHARACTERS
		document.getElementById("comment").addEventListener("keyup", function () {
			document.querySelector("#counting").textContent = `${document.getElementById("comment").value.length}/250`;
		});

		//REGULAR EXPRESSION
		/*$("#btnSend").addEventListener("click", function (e)
			{
				e.preventDefault()
				findErrors()
				console.log("it works");
			});*/

		function findErrors() {
		var wrong = [];
		let fistName, lastName, email, comments;
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


		function checkAll(itemValue, itemRegex, itemDone) {
			if (itemRegex.test(itemValue.value)) {
				itemDone = true;
				if (itemValue.classList.contains("danger"))
					itemValue.classList.remove("danger")
			}
			else
			{
				itemDone = false;
				if (!itemValue.classList.contains("danger"))
					itemValue.classList.add("danger")
			}
		}
		
		checkAll(firstName, firstNameRegex, firstNameDone)
		checkAll(lastName, lastNameRegex, lastNameDone)
		checkAll(email, emailRegex, emailDone)
		checkAll(comment, commentRegex, commentDone)
	};



