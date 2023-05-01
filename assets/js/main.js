		// AJAX
function callingAjax(data, ifItWorks){
$.ajax({
		url:"assets/data/"+data,
		method:"GET",
		dataType:"json",
		success: function(result){
			product=result;
			ifItWorks(result);
		},
		error: function(xhr){
			console.error(xhr);
		}
	});
}

function stockToLocStorage(item, data){
	localStorage.setItem(item, JSON.stringify(data));
}

function importFromLocStorage(item){
	return JSON.parse(localStorage.getItem(item))
}

var url=window.location.pathname;
url=url.substring(url.lastIndexOf('/'));
	
$(document).ready(function(){

	//LOADING
	function loading(){
	
		setTimeout(()=>{
			$('.loading').remove()
		 }, 2000)
	}
	loading();
		
	if(url=="/index.html"){
		callingAjax("navigation.json", showNavigation);
		callingAjax("sorting.json", showDDL);
		callingAjax("gender.json", showGender);
		callingAjax("brands.json", showBrands); 
		callingAjax("prices.json", filterPrices);
		callingAjax("footer.json", showFooter);
	}
	if(url=="/contact.html"){
		callingAjax("navigation.json", showNavigation);
		callingAjax("footer.json", showFooter);
		callingAjax("registration.json", showRegistration);
		/*myCart();
		$("my-cart").hide();*/
	}
	if(url=="/author.html"){
		callingAjax("navigation.json", showNavigation);
		callingAjax("footer.json",showFooter);
		myCart()
	}

		//SHOW NAVIGATION
	function showNavigation(items){
		let html=`<div id="logo">
				    <a href="index.html"><img src="assets/img/logo.png" alt="company logo"/></a>
				  </div>
			 <div id="nav"><ul>`;
		for(let index in items){
			if(index==3){
				html+=`<li><div id="my-bag">
							<i id="pop-up" class="fa fa-shopping-cart" aria-hidden="true"></i>
				  			<span id="items-in-cart"></span>
						</div></li>`;
			}
			else{
				html+=`<li>
						<a href='${items[index].href}' class="nav-item nav-link active" 
						 id="nav-${items[index].id}"> ${items[index].name} </a>
					  </li>`;
			}
		}
			html+=`</ul></div><div class="cleaner"></div>`;
			$('#navigation').html(html);
			$("#pop-up").click(popUp);
			printNumberOfProducts();
	}
		
		//SHOW FOOTER
	function showFooter(items){
		let html="<ul>";
		for (let index of items){
			html+=`<li><a href="${index.link}"> <i class="${index.icons}"></i></a>|</li>`;
		}
		html+="</ul>";
		$('#links').html(html);
	}
		
		//SHOW DROPDOWN LIST 
	function showDDL(items){
		let html=`<option value="most-popular" selected>Most popular</option>`;
		for(let index of items){
			html+=`<option value="${index.value}" class="sortirano">${index.name}</option>`
		}
		$('#sorted').html(html);
		$('#sorted').change(showItems);
	}
		
		//SHOW GENDER
	function showGender (items){
		let html = "<input type='radio' value='0' class='genderClass' name='gender' checked/> all";
		items.forEach(gender => {
			html += `<input type="radio" value="${gender.id}" id="sort-gender-${gender.id}" 
					class="genderClass" name="gender"/> ${gender.name}`;
		});
		$('#gender').html(html);
		gender = items;
		document.getElementById("gender").addEventListener("change", showItems);
	}
		
		//SHOW BRANDS
	function showBrands(data){
		let html="<label class='checkbox' for='checkboxId'>";
		brands=data;
		for(let index in data){
			html += ` <br/><input type="checkbox" id="sort-brand-${index.id}" value="${data[index].id}"
			 			class="brand" name="sort-brand-${index.id}" class="chbx"/>
			 		  <label for="sort-brand-${index.id}">${data[index].name}<br/>`;
			}
		html+=`</label>`;
		$("#brands").html(html);
		callingAjax("products.json", showItems);
		document.querySelector("#brands").addEventListener('click', showItems);
	}
		
		//SHOW PRODUCTS
	function showItems(items){	
		let html='';
		stockToLocStorage("allProducts", items);
		importFromLocStorage(items);
		items=searchItems(items);
		items=sort(items);
		items=filterDiscount(items);
		items=brandFilter(items);
		items=genderFilter(items);
		
		if(items.length==0){
			html+=`<div class="col-4 mx-auto text-center">
					  <p class="alert alert-danger my-3">No products :-(</p>
				   </div>`;
		}
		else{
			for(let index of items){
				 html+=`<div class="col-3">
            				<div class="card">
              			<img class="card-img-top" src="${index.img.src}" alt="${index.img.alt}">
             			    <div class="card-body">
                				<div class="card-title">
				  					<h5>${showBrandOrGender(index.brandId, brands)}</h5>
                  					<h4><b>${index.name}</b></h4>
               			 		</div>
						 		<h5>${showBrandOrGender(index.genderId, gender)}</h5>
								<p class="ab"></p>
								${showPrice(index.price)}
            				</div>
			 				 <div class="Shop">
								<form>
									<input type="button" data-id="${index.id}" 
									class="Add" value="Add to cart"/>
								</form>
			 				 </div>
           				 </div>
         			 </div>`;
			}
		}
		document.querySelector("#row").innerHTML=html;
		$(".Add").click(addToCart);
		$(".Add").click(myCart);
		myCart();
	}
			
		//SHOW PRICES AND DISCOUNT
	function showPrice(data){
		let html='';
		if(data.old !==null){
			html+=`<h5><b>&euro; ${data.new}</b></h5><s>&euro; ${data.old}</s>`;
		}
		else {
				html+=`<h5><b>&euro; ${data.new}</b></h5><br/>`;
		}	
			return html;
	}
			
		//SHOW BRAND OR NAME -CODE REUSE
	function showBrandOrGender(id, type){
		let html="";		
		for(let index of type){
			if(index.id==id){
				return index.name;
			}
		}
	}

		//SHOW SEARCH
	function showSearch(){
		var html=`<form action="" method="">
					<br/>
					<input type="text" id="txSearch" max-length="40" placeholder="Search by name" />
					<span class="shortBar"></span>
					<span class="highlight"></span>
					<input type="button" id="btnSearch" value="Search" />
				  </form>
				  <br/>`;
		document.querySelector("#search").innerHTML=html;
		btnSearch.addEventListener("click", showItems);
	}
	showSearch();

		//SHOW FILTER PRICES

	function filterPrices(items){
		let html=`<label for="itemPrices">Sort by discount<label><br/>
				  <form action="" method="" oninput="valueId.value=selectedDiscount.value">
				  <input type="range" min="20" max="100" value="100" id="selectedDiscount"/>
				  <output id="valueId">100</output>
				  <datalist id="values">`;
				
		for(var index of items){
			html+=`<option value="${index.value}" label="${index.name}"></option>`;
		}
		html+="</datalist></form>";
		$("#discount").html(html);
		document.querySelector("#discount").addEventListener("change", showItems);
	}

		//SORTING PRODUCTS BY IT'S NAME AND PRICE: ASC, DESC

	function sort(items){
		const sortType=$("#sorted").val();
		if(sortType=="name-low-to-high"){
			items.sort(function(item1,item2){
				if(item1.name>item2.name){
					return 1;
				}
				if(item1.name<item2.name){
					return -1;
				}
				if(item1.name==item2.name){
					return 0;
				}
			});
		}
		else if(sortType=="name-high-to-low"){
			items.sort(function(item1,item2){
				if(item1.name<item2.name){
					return 1;
				}
				if(item1.name>item2.name){
					return -1;
				}
				if(item1.name==item2.name){
					return 0;
				}
			});
		}
		else if(sortType=="price-low-to-high"){
			items.sort(function(item1,item2){
				if(item1.price.new>item2.price.new){
					return 1;
				}
				if(item1.price.new<item2.price.new){
					return -1;
				}
				if(item1.price.new==item2.price.new){
					return 0;
				}
			});
		}
		else if(sortType=="price-high-to-low"){
			items.sort(function(item1,item2){
				if(item1.price.new>item2.price.new){
					return -1;
				}
				if(item1.price.new<item2.price.new){
					return 1;
				}
				if(item1.price.new==item2.price.new){
					return 0;
				}
			});
		}
		else{
			items.sort(function(item1,item2){
				if(item1.id<item2.id){
					return -1;
				}
				if(item1.id<item2.id){
					return 1;
				}
				if(item1.id==item2.id){
					return 0;
				}
			});
		}
		return items;
	}
		
		//FILTER FUNCTIONS
		
		//BY BRAND
	function brandFilter(items){
		let filteredItems;
		let selectBrand=$('.brand:checked').val();
		let selectedBrand = [];
		$('.brand:checked').each(function(item){
			selectedBrand.push(parseInt($(this).val()));
		});
		if(selectedBrand.length != 0){
			filteredItems=items.filter(function(item){
				for(var index of selectedBrand)
				if(index==item.brandId){
					return item;
				}
			});
		}
		if(selectedBrand==0){
			filteredItems=items;
		}
		return filteredItems;
	}
		
		//BY GENDER
	function genderFilter(items){
		let filteredItems;
		let selectedGender=$(".genderClass:checked").val();

		if(selectedGender==0){
			filteredItems=items;
		}
		else{
			filteredItems=items.filter(function(item){
				if(selectedGender==item.genderId){
					return item;
				}
			});
		}
		return filteredItems;
	}
		
		//BY SEARCH		
	function searchItems(items){
		let writtenWord =$("#txSearch").val();
		let filteredItems = product.filter(function(item){
			if(item.name.toLowerCase().indexOf(writtenWord.trim().toLowerCase())!=-1){
				return item;
			}
		});
		return filteredItems;
		}
		
		//BY DISCOUNT
	function filterDiscount(items){
		let selectedDiscount=$("#selectedDiscount").val();
		var discount;
		let filteredItems=items.filter(function(item){
			if(item.price.old==null){
				discount=100;
			}
			else if(item.price.old!=null){
				discount=Math.round((item.price.new/item.price.old)*100);
			}
			if(discount<=selectedDiscount){
				return item
			}
		});
		return filteredItems;	
	}
		
		// LOCAL STORAGE
	function stockToLStorage(key, value){
		localStorage.setItem(key, JSON.stringify(value));
	}
	function importFromLStorage(key){
		return JSON.parse(localStorage.getItem(key));
	}
	
		//MY CART
	function myCart(){
    let productsInCart = importFromLStorage("cart");
        if(productsInCart == null){
            EmptyCart();
        }
        else{
            showCart();
        }
	}

	function EmptyCart(){
		html=`<i class="fas fa-dizzy" aria-hidden="true"></i>
		<p><b>Unfortunately, your bag is empty :-( </b></p>
		<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>`;

    	$("#my-cart").html(html);
	}
	
	function showCart(){
		let allProducts = importFromLStorage("allProducts");
    	let productsInCart = importFromLStorage("cart");

    	let productsForDisplay = allProducts.filter(el => {
        	for(let pCart of productsInCart){
            	if(el.id == pCart.id){
                	el.qty = pCart.qty;
                	return true;
            	}
        	}
        	return false;
    	})
    	printTable(productsForDisplay);
	}
	
	function printTable(products){
    	let html = `<div id="close"><button id="closing">x</button></div><div class="cleaner"></div>
						<table class="table-my-cart">
    						<thead>
								<tr>
									<th>No.</th>
									<th>Product</th>
									<th>Product Name</th>
									<th>Price per Unit</th>
									<th>Units</th>
									<th>Total Price</th>
									<th>Remove</th>
								</tr>
							</thead>
							<tbody>`;
    	let total = 0;
    	for(let index of products){
        	html += createTableRow(index);
        	total = total + (index.price.new * index.qty);
    	}

   		 html +=`	</tbody>
    			</table>
				<div id="total-price"></div>
				<button id="emptyCart"><i class="fa fa-trash-o"></i>Empty Cart</button>
				<a href="contact.html"><button id='send'><i class="fa fa-send"></i>Order</button></a>`;

		let htmlTotal=`<p>Total price:<b>${total} &euro;</b></p>`;

   		$("#my-cart").html(html);
  	    $(".btn-remove").click(removeFromCart);
    	$("#total-price").html(htmlTotal);
		$("#closing").click(function(){
			$("#my-cart").toggle("fast");
		});
		$("#emptyCart").click(removeAll);
	}

	function removeAll(){
		console.log("radi brisanje");
		localStorage.removeItem("cart");
		myCart();
		printNumberOfProducts();
	}

	function removeFromCart(){
    	let productId = $(this).data("id");
    	let productsInCart =importFromLStorage("cart");
    	let filtered = productsInCart.filter(index => index.id != productId);

    	if(filtered.length == 0){
        	localStorage.removeItem("cart");
    	}
    	else{
        	stockToLStorage("cart", filtered);
	    }
    	myCart();
		printNumberOfProducts();
	}
	
	function createTableRow(item){
    	return  `<tr class="cart-item">
    				<td>${item.id}</td>
    				<td>
        				<a href="single.html">
            <img src="${item.img.src}" style='height:100px' alt="${item.img.alt}" class="img-responsive">
        				</a>
    				</td>
    				<td>${item.name}</td>
    				<td>${item.price.new}&euro;</td>
   				    <td>${item.price.new}&euro;</td>
    				<td>${item.qty}</td>
    				<td><b>${item.price.new * item.qty}&euro;</b></td>
    				<td>
        				<div class="card-item-button">
            				<button class='btn-remove' data-id='${item.id}'>
								<i class="fa fa-times"></i>
								Remove
							</button>
        				</div>
    				</td>
				</tr>`;
	}	

	function addToCart(){
    	let productId = $(this).data("id");
 	    let productsInCart =importFromLStorage("cart");
    
		if(productsInCart == null){
     	   addFirstItemToCart();
        	printNumberOfProducts();
    	}
    	else{
        	if(productIsAlreadyInCart()){
            	updateQty();
        	}
        	else{
            	addItemToCart();
           		printNumberOfProducts();
       		}
    	}

    function addFirstItemToCart(){
        let products = [
            {
                id: productId,
                qty: 1
            }
        ];
        stockToLStorage("cart", products);
    }

    function productIsAlreadyInCart(){
        return productsInCart.filter(el => el.id == productId).length;
    }

    function updateQty(){
        let productsLS = importFromLStorage("cart");

        for(let p of productsLS){
            if(p.id == productId){
                p.qty++;
                break;
            }
        }

        stockToLStorage("cart", productsLS);
    }

	//ADD TO CART
    function addItemToCart(){
        let productLS = importFromLStorage("cart");

        productLS.push({
            id: productId,
            qty: 1
        });

        stockToLStorage("cart", productLS);
    }
}
	
	//SHOW NUMBER OF DIFFERENT ITEMS IN CART
	function printNumberOfProducts(){
    	let productsInCart = importFromLStorage("cart");

	    if(productsInCart == null){
			let html="";
        	$("#items-in-cart").html(html);
    	}
    	else{
        	let number = productsInCart.length;
        	$("#items-in-cart").html(number);
    	}
	}

		//POP-UP MY CART
	$("#my-cart").hide();
	function popUp(){
		$("#my-cart").toggle("fast");
	}
		
		//SLIDER
	setInterval(slider, 4000);
	var counter = 1;
	function slider() {
		document.querySelector("#slider img").src = "assets/img/slide" + counter + ".png";
		counter++;
		if (counter == 6) {
							counter = 1;
		}
	}
	slider();
});

	//SCROLL TO TOP
$(window).scroll(function(){
	if($(this).scrollTop()>50){
		$("#scrollUp").fadeIn(100);
	}
	else
	{
		$("#scrollUp").fadeOut(100);
	}
});

$("#scrollUp").click(function(){
	$("body, html").animate({scrollTop:0},500
	);
});

	//CONTACT US
function showRegistration(items){
	let html=`<br/><h3>Give us information about ordered items</h3>
		<div id="contactUs">`;

	for(let index of items){
		html+=`<div class="text-tabs">
			     <input type="${index.value}" class="validation" cols="40" id="${index.name}"
				   placeholder="${index.site}"/>
				   <p class="alert alert-danger mistake">
				   		<i>Value ${index.site} is not correct</i>
				   </p>
				   <span class="highlight"></span>
      			   <span class="bar"></span>
			  </div>`;
	}

	html+=`<form>
			   <div class="text-tabs">
					<textarea class="form-control" name="comment" rows="7"
				     cols="29" id="comment" placeholder="Write a comment" 
					 maxlength="250"></textarea>
					<div id="counting">0/250</div>
				</div>
					<button id="btnSend"><i class="fa fa-send"></i>Send</button>
				</form>
				<div class="cleaner">
				</div>
			</div>
				<div id="main2">
					<iframe class="location" 
					src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22657.891732856893!2d20.377329310839837!3d44.775984300000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a6fd2ea833ea7%3A0xc3a5e33186da134!2sAPOLON!5e0!3m2!1ssr!2srs!4v1682868356255!5m2!1ssr!2srs" 
					width="400" height="300" style="border:0;" allowfullscreen="" 
					loading="lazy" referrerpolicy="no-referrer-when-downgrade">
					</iframe>
					<div class="cleaner"></div>
				<div>`;

	$("#main1").html(html);
			
		//COUNTING CHARACTERS
	document.getElementById("comment").addEventListener("keyup", function () {
		document.querySelector("#counting").textContent = `
		${document.getElementById("comment").value.length}/250`;
	});

		//REGULAR EXPRESSION
	document.querySelector("#btnSend").addEventListener("click", function (e){
		e.preventDefault()
		findErrors()
	});
}
	function findErrors() {
		var wrong = [];
		let firstName, lastName, email, comments;
		firstName = document.querySelector("#firstName");
		lastName = document.querySelector("#lastName");
		email = document.querySelector("#email");
		comment = document.querySelector("#comment");

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
