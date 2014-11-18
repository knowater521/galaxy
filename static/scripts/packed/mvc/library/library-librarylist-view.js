define(["galaxy.masthead","mvc/base-mvc","utils/utils","libs/toastr","mvc/library/library-model","mvc/library/library-libraryrow-view"],function(b,g,d,e,c,a){var f=Backbone.View.extend({el:"#libraries_element",events:{"click .sort-libraries-link":"sort_clicked"},defaults:{page_count:null,show_page:null},initialize:function(h){this.options=_.defaults(this.options||{},this.defaults,h);var i=this;this.modal=null;this.rowViews={};this.collection=new c.Libraries();this.collection.fetch({success:function(){i.render()},error:function(k,j){if(typeof j.responseJSON!=="undefined"){e.error(j.responseJSON.err_msg)}else{e.error("An error ocurred.")}}})},render:function(i){this.options=_.extend(this.options,i);if((this.options.page_size!=null)&&(this.options.page_size==parseInt(this.options.page_size))){Galaxy.libraries.preferences.set({library_page_size:parseInt(this.options.page_size)})}$(".tooltip").hide();var j=this.templateLibraryList();var k=null;var l=null;if(this.options.show_page===null||this.options.show_page<1){this.options.show_page=1}if(typeof i!=="undefined"){l=typeof i.models!=="undefined"?i.models:null}if(this.collection!==null&&l===null){this.sortLibraries();if(Galaxy.libraries.preferences.get("with_deleted")){k=this.collection.models}else{k=this.collection.where({deleted:false})}}else{if(l!==null){k=l}else{k=[]}}this.options.total_libraries_count=k.length;var h=(Galaxy.libraries.preferences.get("library_page_size")*(this.options.show_page-1));this.options.page_count=Math.ceil(this.options.total_libraries_count/Galaxy.libraries.preferences.get("library_page_size"));if(this.options.total_libraries_count>0&&(h<this.options.total_libraries_count)){k=k.slice(h,h+Galaxy.libraries.preferences.get("library_page_size"));this.options.libraries_shown=k.length;if(Galaxy.libraries.preferences.get("library_page_size")*this.options.show_page>(this.options.total_libraries_count+Galaxy.libraries.preferences.get("library_page_size"))){k=[]}this.$el.html(j({length:1,order:Galaxy.libraries.preferences.get("sort_order")}));Galaxy.libraries.libraryToolbarView.renderPaginator(this.options);this.renderRows(k)}else{this.$el.html(j({length:0,order:Galaxy.libraries.preferences.get("sort_order")}));Galaxy.libraries.libraryToolbarView.renderPaginator(this.options)}$("#center [data-toggle]").tooltip();$("#center").css("overflow","auto")},renderRows:function(l){for(var k=0;k<l.length;k++){var j=l[k];var h=_.findWhere(this.rowViews,{id:j.get("id")});if(h!==undefined&&this instanceof Backbone.View){h.delegateEvents();this.$el.find("#library_list_body").append(h.el)}else{this.renderOne({library:j})}}},renderOne:function(j){var i=j.library;var h=new a.LibraryRowView(i);this.$el.find("#library_list_body").append(h.el);this.rowViews[i.get("id")]=h},sort_clicked:function(){if(Galaxy.libraries.preferences.get("sort_order")==="asc"){Galaxy.libraries.preferences.set({sort_order:"desc"})}else{Galaxy.libraries.preferences.set({sort_order:"asc"})}this.render()},sortLibraries:function(){if(Galaxy.libraries.preferences.get("sort_by")==="name"){if(Galaxy.libraries.preferences.get("sort_order")==="asc"){this.collection.sortByNameAsc()}else{if(Galaxy.libraries.preferences.get("sort_order")==="desc"){this.collection.sortByNameDesc()}}}},redirectToHome:function(){window.location="../"},redirectToLogin:function(){window.location="/user/login"},templateLibraryList:function(){tmpl_array=[];tmpl_array.push('<div class="library_container table-responsive">');tmpl_array.push("<% if(length === 0) { %>");tmpl_array.push('<div>There are no libraries visible to you here. If you expected some to show up please consult the <a href="https://wiki.galaxyproject.org/Admin/DataLibraries/LibrarySecurity" target="_blank">library security wikipage</a> or visit the <a href="https://biostar.usegalaxy.org/" target="_blank">Galaxy support site</a>.</div>');tmpl_array.push("<% } else{ %>");tmpl_array.push('<table class="grid table table-condensed">');tmpl_array.push("   <thead>");tmpl_array.push('     <th style="width:30%;"><a class="sort-libraries-link" title="Click to reverse order" href="#">name</a> <span title="Sorted alphabetically" class="fa fa-sort-alpha-<%- order %>"></span></th>');tmpl_array.push('     <th style="width:22%;">description</th>');tmpl_array.push('     <th style="width:22%;">synopsis</th> ');tmpl_array.push('     <th style="width:26%;"></th>');tmpl_array.push("   </thead>");tmpl_array.push('   <tbody id="library_list_body">');tmpl_array.push("   </tbody>");tmpl_array.push("</table>");tmpl_array.push("<% }%>");tmpl_array.push("</div>");return _.template(tmpl_array.join(""))},});return{LibraryListView:f}});