		
		//var artikli=[];
		/*var gender=[];
		var brands=[];*/
		/*function getLocalStorageItem(name, item){
			localStorage.setItem(name,JSON.stringify(item));
		}
		function readLocalStorageItem(name){
			return JSON.parse(localStorage.getItem(name));
		}*/
		//LOADING
		function loading(){
			//window.onload=function(){
				console.log("radim");
				setTimeout(()=>{
					$('.loading').remove()
				}, 2000)
				//}
			}
		
		//AJAX
		
		function callingAjax(data, ifItWorks){
		$.ajax({
				url:"assets/data/"+data,
				method:"GET",
				dataType:"json",
				success: 
				function(result){
				artikli=result;
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
		
window.onload=function(){
		loading();
		callingAjax("navigation.json", showNavigation);
		//callingAjax("products.json", getLocalStorageItem)
		
		//SHOW NAVIGATION
		function showNavigation(items){
			 let html='<ul>';
			for(let index in items){
				if(index==4){
					html+=`<li><div class="nav-items"><a href='#' id="my-bag">${items[index].name} <span id="items-in-cart">${showNumber()}</span></a></div></li>`;
				}
				else{
					html+=`
					<li><div class="nav-items"><a href='${items[index].href}' id="nav-${items[index].id}">${items[index].name}</a></div></li>
				`;
				}
			}
			html+=`</ul>`
			$('#navigation').html(html);
			
			callingAjax("sorting.json", showDDL);
		}
		
		//SHOW DROPDOWN LIST 
		
		function showDDL(items){
			let html=`<option value="most-popular" selected>Most popular</option>`;
			//let html;
			for(let index of items){
				html+=`
				<option value="${index.value}" class="sortirano">${index.name}</option>`
			}
			//html+=`</select>`
			$('#sorted').html(html);
			
		  
		   callingAjax("gender.json", showGender);
		}
		
		//SHOW GENDER
		
		function showGender (items){
		let html = "<input type='radio' value='0' class='genderClass' name='gender'/> all";
		items.forEach(gender => {
			html += `
					   <input type="radio" value="${gender.id}" class="genderClass" name="gender"/> ${gender.name}
					`;
		});
		//console.log(html);
		$('#gender').html(html);
		gender = items;
		$('genderClass').change(filterChange);
		callingAjax("brands.json", showBrands); 
	}
		
		//SHOW BRANDS
		
		function showBrands(data){
			let html="";
			brands=data;
			for(let index in data){
				html += `
					   <input type="checkbox" value="${data[index].id}" class="brand" name="brands"/> ${data[index].name}
					`;
			}
			$("#brands").html(html);
			callingAjax("products.json", showItems);
		}
		
		//SHOW PRODUCTS
		function showItems(items){	
			let html='';
			console.log(items);
			stockToLocStorage("allProducts", items);
			importFromLocStorage(items);
			
			for(let index of items){
				 html+=`<div class="col-4">
            <div class="card">
              <a href="#"><img class="card-img-top" src="${index.img.src}" alt="${index.img.alt}"></a>
              <div class="card-body">
                <div class="card-title">
				  <h3>${showBrandOrGender(index.brandId, brands)}</h3>
                  <h2><b>${index.name}</b></h2>
                </div>
				<h5>${showBrandOrGender(index.genderId, gender)}</h5>
				<p class="ab"></p></h6>
				${showPrice(index.price)}
				<p class="card-text">
                </p>
               <p class="card-text"></p>
              </div>
			  <div class="Shop">
				<form>
					<input type="button" data-id="${index.id}" class="Add" value="Add to cart"/>
				</form>
			  </div>
            </div>
          </div>`;
			}
			document.querySelector("#row").innerHTML=html;
			$(".Add").click(addToCart);
		}
		callingAjax("prices.json", filterPrices);
		
		
		//SHOW PRICES AND DISCOUNT
		function showPrice(data){
			let html='';
			if(data.old !==null){
				html+=`<h5><b>&euro; ${data.new}</b></h5><s>&euro; ${data.old}</s>`
			}
			else {
				html+=`<h5><b>&euro; ${data.new}</b></h5><br/>`
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

		
		 function filterChange(){
		callingAjax("products.json", showItems);
		}

		console.log("da li radi?");
		
		//SHOW SEARCH
		function showSearch(){
			var html;
			
			html=`<form action="" method="">
					<br/>
					<input type="text" id="txSearch" max-length="40" placeholder="Search by name" />
					<input type="button" id="btnSearch" value="Search" />
				  </form>
				  <br/>`;
			document.querySelector("#search").innerHTML=html;
		}
		showSearch();
		
		//SHOW FILTER PRICES
		function filterPrices(items){
				let html=`<label for="itemPrices">Sort by discount<label><br/>
				<form action="" method="" oninput="valueId.value=selectedDiscount.value">
					<input type="range" min="20" max="100" value="100" id="selectedDiscount"/><output id="valueId">100</output>
						<datalist id="values">`;
				
				for(var index of items){
					html+=`
					<option value="${index.value}" label="${index.name}"></option>
					`;
				}
				html+="</datalist></form>"
				$("#discount").html(html);
		}
		
		//SORTING PRODUCTS BY IT'S NAME AND PRICE: ASC, DESC
		sorted.addEventListener('change', sort);
		function sort(items){
			const sortType=$("#sorted").val();
			console.log(sortType);

			if(sortType=="name-low-to-high"){
				artikli.sort(function(item1,item2){
					if(item1.name>item2.name){
						return 1;
					}
					if(item1.name<item2.name){
						return -1;
					}
					if(item1.name==item2.name){
						return 0;
					}
					console.log(artikli);
				});
			}
				else if(sortType=="name-high-to-low"){
					artikli.sort(function(item1,item2){
					if(item1.name<item2.name){
						return 1;
					}
					if(item1.name>item2.name){
						return -1;
					}
					if(item1.name==item2.name){
						return 0;
					}
					console.log(artikli);
				});
				}
				else if(sortType=="price-low-to-high"){
					artikli.sort(function(item1,item2){
					if(item1.price.new>item2.price.new){
						return 1;
					}
					if(item1.price.new<item2.price.new){
						return -1;
					}
					if(item1.price.new=item2.price.new){
						return 0;
					}
					console.log(artikli);
				});
				}
				else if(sortType=="price-high-to-low"){
					artikli.sort(function(item1,item2){
					if(item1.price.new>item2.price.new){
						return -1;
					}
					if(item1.price.new<item2.price.new){
						return 1;
					}
					if(item1.price.new=item2.price.new){
						return 0;
					}
					console.log(artikli);
				});
				}
				else{
					artikli.sort(function(item1,item2){
					if(item1.id<item2.id){
						return -1;
					}
					if(item1.id<item2.id){
						return 1;
					}
					if(item1.id=item2.id){
						return 0;
					}
					console.log(artikli);
				});
				}
				showItems(artikli);
		}
		
		//FILTER FUNCTIONS
		
		//BY BRAND
		document.querySelector("#brands").addEventListener('click', brandFilter);
		
		function brandFilter(){
			let selectBrand=$('.brand:checked').val();
		let selectedBrand = [];
		$('.brand:checked').each(function(item){
			selectedBrand.push(parseInt($(this).val()));
			console.log(selectedBrand);
		});
		console.log(selectedBrand.length);
		if(selectedBrand.length != 0){
			console.log(selectedBrand.length);
			console.log(artikli);
			artiklifilter=artikli.filter(function(item){
				for(var index of selectedBrand)
				if(index==item.brandId){
					console.log(item);
					return item;
				}
			});
		}
		if(selectedBrand==0){
				artiklifilter=artikli;
			}
		showItems(artiklifilter);
		
	}
		//BY GENDER
		
		document.getElementById("gender").addEventListener("change", genderFilter);
		function genderFilter(){
			let selectedGender=$(".genderClass:checked").val();
			//let selectedGender=[];
			if(selectedGender==0){
				artiklifilter=artikli;
			}
			else{
			artiklifilter=artikli.filter(function(item){
				if(selectedGender==item.genderId){
					return item;
				}
			});
			}
			console.log(selectedGender);
			showItems(artiklifilter);
		}
		
		//BY SEARCH
		btnSearch.addEventListener("click", searchItems);
		
		function searchItems(){
			let writtenWord =$("#txSearch").val();
			console.log(writtenWord);
			let filteredItems = artikli.filter(function(item){
				if(item.name.toLowerCase().indexOf(writtenWord.trim().toLowerCase())!=-1){
					return item;
				}
			});
			showItems(filteredItems);
		}
		
		//BY DISCOUNT
		
		document.querySelector("#discount").addEventListener("change", filterDiscount);
		
		function filterDiscount(){
			let selectedDiscount=$("#selectedDiscount").val();
			var discount;
			console.log(selectedDiscount);
			let filteredItems=artikli.filter(function(item){
				if(item.price.old==null){
					discount=100;
				}
				else if(item.price.old!=null){
					discount=Math.round((item.price.old/item.price.new)*100);
					//console.log(discount);
				}
				if(discount<selectedDiscount){
					return item
				}
			});
			showItems(filteredItems);
			
		}
		
		//MY CART
		/*console.log("radim li?");
		function getLocalStorageItem(name){
			let item = localStorage.getItem(name);
				if(item){
							parsedItem = JSON.parse(item);
							if(parsedItem.length > 0){
							return parsedItem;
							
							}
						}
					return false;
				}
		function myCart(){
	
		}*/
		//numberOfItemsInBag();
		
		/*
		
		*/
		
		// LOCAL STORAGE
		
		var itemsInBag=importFromLocStorage("cart");
		var productsFromStorage=importFromLocStorage("allProducts");
		
		
		function addToCart(){
			//console.log("pera");
			var itemId = $(this).data("id");
			//var itemsInBag=importFromLocStorage("cart");
			console.log(itemId);
			
			console.log(itemsInBag);
			if(itemsInBag==null){
				sendToCart(itemId);
			}
			else{
				if(itemInCart(itemsInBag, itemId)){
					editNumber(itemId);
				}
				else{
					exportToLocStorage(itemId);
					showNumber();
				}
				
			}
		}
		
		//IF "MY CART" IS EMPTY, SEND THE FIRST ITEM TO LOCAL STORAGE
		function sendToCart(selectedId){
			var products=new Array();
			products[0]={
				id:selectedId,
				pieces:1
			};
			stockToLocStorage("cart", products);
		}
		
		//FUNCTION IS CHECKING IS SELECTED ITEM ALREADY IN "MY CART"

		function itemInCart(items, id){
			return items.filter(p=>p.id==id).length;
		}
		
		//IF "MY CART" ALREADY HAVE THIS ITEM, CHANGE QUANTITY
		function editNumber(selId){
			//let itemsFromLocStorage=importFromLocStorage("cart");
			
			for(let items of itemsInBag){
				if(items.id==selId)
				{
					items.pieces++;
					break;
				}
			}
			stockToLocStorage("cart", itemsInBag);
		}
		//NEXT ITEM TO CART
		function exportToLocStorage(selectedId){
			itemsInBag.push({
				id:selectedId,
				pieces:1
			});
			stockToLocStorage("cart", itemsInBag);
		}
		

		//MY CART NUMBER OF ITEMS
		function showNumber(){
			console.log(itemsInBag);
			if(itemsInBag==null){
				return " ";
			}
			if(itemsInBag==0){
				return 0;
			}
			else{
				return itemsInBag.length;
			}
			//itemsInBag.length==null?myCartNumber.innerHTML="" : myCartNumber.innerHTML+=`${itemsInBag.length}`;
			//itemsInBag.length!=null?console.log("nista"):console.log(itemsInBag.length);
		}
		
		
	
		//MY CART FOR CLIENT
		$(document).ready(function(){
			if(itemsInBag!=null){
				showPieces();
			}
			else{
				bagIsEmpty();
			}
		});
		
		function bagIsEmpty(){
			$("#my-cart").html("<p>Unfortunately, your bag is empty :-( </p>");
			console.log("ne radimo danas");
		}
		
		function showPieces(){
			var orderedItems=productsFromStorage.filter(item=>{
				for(let index of itemsInBag){
					if(item.id==index.id){
						item.pieces=index.pieces;
						console.log(item.pieces);
						return true;
					}
				}
				
				return false;
			});
			showBag(orderedItems);
			totalCalculator();

		}
		
		function showBag(items){
			htm = `<table border="1px solid">
					<thead>	
						<tr>
							<th>No</th>
							<th>Product name</th>
							<th>Price per unit</th>
							<th>Units</th>
							<th>Total price per product</th>
						</tr>
					</thead>
					<tbody>`;
			for(let index of items){
				htm += `<tr>
							<td>${index.id}</td>
							<td>${index.name}</td> 
							<td>${index.price.new}</td>
							<td>${index.pieces}</td>
							<td>${totalPerUnit(index.price.new, index.pieces)}</td>
							<td><input type="button" onclick="" value="Remove"/></td>
						</tr>`;
			}
			$("#my-cart").html("<p>"+htm+"</p><div class='total'></div>");
		}
		//TOTAL PRICE PER UNIT
		function totalPerUnit(price, units) {
			return price * units;
		}
		
		//TOTAL PRICE
		function totalCalculator(){
			var totalPrice=0;
			itemsInBag.forEach(index=>{
					let item =productsFromStorage.filter(x=>x.id==index.id);
					totalPrice=totalPrice+(item[0].price.new*index.pieces);
					console.log(index.id+" "+totalPrice);
			});
			$(".total").html("<p>Total price: "+totalPrice+"</p>");		
		}

		//ITEMS IN BAG
		
		
		//REMOVE FROM BAG
	/*	function deleteFromBag(id){
			console.log("brisanje radi");
			var productsFromCart=importFromLocStorage("cart");
			let filterItem=productsFromCart.filter(index=>index.id!=id);
			
			if(filterItem.length==0){ localStorage.clear;
				stockToLocStorage("cart", filterItem);
			console.log("i drugi deo radi");
			showBag(filterItem)
			}
			
		}
*/
			//ADD TO CART ITEM
	/*	$(document).ready(function(){
				$("#order").hide();
				$(".Add").click(function(e){
					console.log("dodato u korpu");
					e.preventDefault();
					$("#order").show("fast");
				});
					
		});*/
			//POP-UP MY CART
		$(document).ready(function(){
			console.log("ucitavam");
			$("#my-cart").hide();
			$("#my-bag").click(function(e){
				console.log("reagujem");
				e.preventDefault();
				$("#my-cart").toggle("fast");
			});
		});
		
}
