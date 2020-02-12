/**
 * Ultimas noticias
 * 
 * Faça uma lista de noticias criando 
 * com o D3 cards de Botstrap
 * 
 * Foco: Incorporacao do D3 com 
 * outras bibliotecas
 */
/*
<!-- Modal -->
    <div class="modal fade" id="newsModal" tabindex="-1" role="dialog" aria-labelledby="newsModalTitle"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="newsModalTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>
*/

d3.select("body").append("div").attr("class","modal fade").attr("id","newsModal").attr("tabindex","-1")
    .attr("role","dialog").attr("aria-labelledby","newsModalTitle").attr("aria-hidden","true")
    .html("<div class='modal-dialog' role='document'>"+
    "<div class='modal-content'>"+
        "<div class='modal-header'>"+
            "<h5 class='modal-title' id='newsModalTitle'>Modal title</h5>"+
            "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                "<span aria-hidden='true'>&times;</span>"+
            "</button>"+
        "</div>"+
        "<div class='modal-body'>"+
            "<p>...</p>"+
        "</div>"+
        "<div class='modal-footer'>"+
            "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"+
            "<button id='link' type='button' class='btn btn-primary'>Access The News</button>"+
        "</div>"+
    "</div>"+
"</div>");

withNewsDo((dataset)=>{
    var tag = d3.select("#news");

    //var size = getSize("#news");

    tag.selectAll(".card").data(dataset).enter().append("div").attr("class","card");

    tag.selectAll(".card").data(dataset).html((d)=>{
            var s = d.title;
            if(s.length>70)s = s.slice(0,68)+"...";
            var t = s;
            if(t.length>30)t = t.slice(0,28)+"...";

            return "<div class='card-body'>"+
                        "<a href='#'><h6 class='card-title'>"+t+"</h6></a>"+
                        "<p class='card-text'>"+s+"</p>"+
                    "</div>"
        }).on("click",(d)=>{
            var modal = d3.select('#newsModal');
            modal.select("#newsModalTitle").text(d.title);
            modal.select(".modal-body").select("p").text(d.description)
            modal.select("#link").on("click",function(){
                window.location.assign(d.link);
            })
            $('#newsModal').modal('show')
        })

    .exit().remove();
})