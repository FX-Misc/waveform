"use strict;"
T = T || {};

T.CutFileStr = function(){
	var vector = function(n){return new Uint32Array(new ArrayBuffer(n*4));}

	var N = parseInt(T.N);
	var theCut = vector(N);
	G = T.cutInds.length;
	G = G > 29? 29 : G;

	//convert cutInds nested arrays into a single vector giving a gorup number for each spike
	for(var g=0;g<G;g++){
		var cut_g = T.cutInds[g];
		var Glen = cut_g.length;
		for(var i=0;i<Glen;i++)
			theCut[cut_g[i]] = g+1;
	}

	var str = [
		'n_clusters: ' + G,
		'n_channels: 4',
		'n_params: 0',
		'times_used_in_Vt: 0 0 0 0']

	for(g=0; g<G; g++){
		str.push(' cluster: ' + g + 'center: 0 0 0 0 0 0 0 0');
		str.push(' min:   0 0 0 0 0 0 0 0');
		str.push(' max:   0 0 0 0 0 0 0 99');
	}
	str.push('');
	str.push('Exact_cut_for: unknown_exp spikes: ' + N);
    
	str = [str.join('\n') + '\n'];
	for(i=0;i<N;i++)
		str.push(theCut[i] + ' ');

	str = str.join('');

	return str;
}

T.SaveFileDragStart = function(evt){
	var exp = T.exps[$(this).data('expind')];
	var bricktype = $(this).data('bricktype');
	
	if (bricktype == 'new cut')
		T.SaveCutDragStart(evt,exp);
		
	//todo: for completeness it might be nice to implement dragging of other files too
}

T.SaveCutDragStart = function(evt,exp){
	var b = new Blob([T.CutFileStr()], {type: 'text/plain'});
	var blobURL = window.URL.createObjectURL(b);
    var filename = exp.name + "_" + T.tet +".cut";
    evt.originalEvent.dataTransfer.setData("DownloadURL",'application/octet-stream:' + filename +':' + blobURL);
    return true;
};

window.URL = window.webkitURL || window.URL;

T.$files_panel.on("dragstart",".file_brick",T.SaveFileDragStart);

