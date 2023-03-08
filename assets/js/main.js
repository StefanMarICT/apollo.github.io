		
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
			console.log("ne radi");
			//window.onload=function(){
				console.log("radim");
				setTimeout(()=>{
					$('.loading').remove()
				}, 2500)
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
		
window.onload=function(){
		loading();
		callingAjax("navigation.json", showNavigation);
		//callingAjax("products.json", getLocalStorageItem)
		//SHOW NAVIGATION
		function showNavigation(items){
			 let html='';
			for(let index in items){
			
				html+=`
					<div class="nav-items"><a href='${items[index].href}' id="">${items[index].name}</a></div>
				`;
			}
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
		console.log(html);
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
			
			for(let index of items){
				 html+=`<div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100">
              <a href="#"><img class="card-img-top" src="${index.img.src}" alt="${index.img.alt}"></a>
              <div class="card-body">
                <h4 class="card-title">
				  <h2>${showBrandOrGender(index.brandId, brands)}</h2>
                  <a href="#">${index.name}</a>
                </h4>
				<h5>${showBrandOrGender(index.genderId, gender)}</h5>
				<p class="ab"></p></h6>
				${showPrice(index.price)}
				<p class="card-text">
                </p>
               <p class="card-text"></p>
              </div>
			  <div class="Shop">
				<form>
					<input type="button" id="Add" value="Add to cart"/>
				</form>
			  </div>
            </div>
          </div>`;
			}
			document.querySelector("#row").innerHTML=html;
		}
		callingAjax("prices.json", filterPrices);
		
		//SHOW PRICES AND DISCOUNT
		function showPrice(data){
			let html='';
			if(data.old !==null){
				html+=`<h5><b>&euro; ${data.new}</b></h5>
                <s>&euro; ${data.old}</s>`
			}
			else {
				html+=`<h5><b>&euro; ${data.new}</b></h5>`
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
			//console.log("maja me mnogo voli");
			let selectedDiscount=$("#selectedDiscount").val();
			var discount;
			console.log(selectedDiscount);
			let filteredItems=artikli.filter(function(item){
				if(item.price.old==null){
					discount=100;
				}
				else if(item.price.old!=null){
					discount=Math.round((item.price.old/item.price.new)*100);
					console.log(discount);
				}
				if(discount<selectedDiscount){
					return item
				}
			});
			showItems(filteredItems);
			
		}
		
		//MY CART
		console.log("radim li?");
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
	
		}
}