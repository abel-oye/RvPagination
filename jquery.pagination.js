/***********************************************
* 分页插件
* createdby：River
* createdDate：2014-04-23
*
***********************************************/
!function($){
	var RvPagination =function(element,options){
		this.$el = $(element);
		this.opts = options;
	}

	RvPagination.prototype={
		_init:function(){
			var that = this,
			$el = that.$el,
			opts  = that.opts,
			pageHtmls = [
				"<div class='pageList'></div>",
				"<div class='totalPage'></div>",
				"<div class='skipPage'></div>",
				"<div class='limit'><select></select></div>"
			];
			$el.empty()
			    .addClass("RvPage")
			    .append($(pageHtmls.join('')));

			that.$pageList = $el.find(".pageList");
			that.$totalPage = $el.find(".totalPage");
			that.$skipPage = $el.find(".pageList");
			that.$limit = $el.find(".limit select");
		},
		_plain:function(page, totalPage , limit){
			var that = this,
				$el = that.$el,
				$pageList = that.$pageList,
				$limit = that.$limit,
				$totalPage = that.$totalPage,
				$skipPage = that.$skipPage,
				opts = that.opts,
				pageNo = opts.pageNo;
			var totalCount = totalPage % limit === 0 ? parseInt(totalPage/limit) : parseInt(totalPage/limit)+1;
			//页码
			if(pageNo.first){
				var $first = $("<span class='prev'><a>"+pageNo.first+"</a></span>");
				if(page < 2){
					$first.addClass("disable");
				}else{
					$first.delegate("a","click",function(){
						that.curPage = 1;
						that.callback();
					});
				}
				$pageList.append($first);
			}

			if(pageNo.prev){
				var $prev = $("<span class='prev'><a>"+pageNo.prev+"</a></span>");
				if(page < 2){
					$prev.addClass("disable");
				}else{
					$prev.delegate("a","click",function(){
						that.curPage = page - 1;
						that.callback();
					});
				}
				$pageList.append($prev);
			}

			if(pageNo.next){
				var $next = $("<span class='prev'><a>"+pageNo.next+"</a></span>");
				if(page >= totalCount){
					$next.addClass("disable");
				}else{
					$next.delegate("a","click",function(){
						that.curPage = page + 1;
						that.callback();
					});
				}
				$pageList.append($next);
			}

			if(pageNo.last){
				var $last = $("<span class='prev'><a>"+pageNo.last+"</a></span>");
				if(page >= totalCount){
					$last.addClass("disable");
				}else{
					$last.delegate("a","click",function(){
						that.curPage = totalCount;
						that.callback();
					});
				}
				$pageList.append($last);
			}
			//显示页面信息
			$totalPage.text(page+"/"+totalCount);
			//输入跳转页
			$skipPage.append("<input name='curPage'/>")
				.append($("<button type='button'>跳转</button>")
					.on("click",function(){
						var skipPageNo = $el.find("[name='curPage']").val();
						if(skipPageNo > totalPage || skipPageNo < 0){
							alert("页码输入错误")
						}else{
							that.curPage = skipPageNo;
							that.callback();
						}
			}));

			//选择页数
			if(opts.selLimit){
				var ops = [];
				$.each(opts.limitList,function(inx,item){
					ops.push("<option value='"+item+"'>"+item+"</option>");
				});
				$limit.append(ops.join('')).on("change",function(){
					$el.limit  = $(this).val();
					that.callback();
				});
			}



		},
		load:function(page, totalPage , limit , callback){
			this._init();
			this.callback = callback;
			this.limit = limit;
			this.curPage = page;
			this._plain(page, totalPage , limit);
		}
	}

	$.fn.rvPagination = function(){
		if(arguments.length === 0 || typeof arguments[0] === "object"){
			var option = arguments[0],
			options = $.extend({},$.fn.rvPagination.defaults,option);
			return new RvPagination(this[0],options);
		}
	}
	$.fn.rvPagination.defaults={
		pageParamName:"page",
		limitParamName:"limit",
		isShowPageNum:false,
		pageNo:{
			"first":"首页",
			"prev":"上一页",
			"next":"下一页",
			"last":"末页"
		},
		selLimit:true,
		limitList:[10,20,50]
	}
	$.fn.rvPagination.Constructor=RvPagination;
}(window.jQuery)