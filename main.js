/*
THIS IS MY FIRST LITTLE PROJECT, AND I KNOW THAT THIS CODE IS NOT PERFECT,
SO, JUST, SORRY FOR THIS; I WILL REWRITE IT LATER AT ALL.
*/

window.onload = function() {
	var element = document.getElementById('rubic');
	var cubeOptions = {
		element: element,
		sizeStep: 75,
		rotateType: '2d',
		styles: {
			lightSelector: 'boxShadow',
			lightOptions: 'inset 0 0 100px 5px rgba(0,0,0,0.6)',
			opacity: {
				external: 1,
				internal: 1
			},
			colors: {
				color0: 'rgba(10,10,10,1)',
				color1: 'rgba(255,255,255,1)',
				color2: 'rgba(255,255,50,1)',
				color3: 'rgba(255,125,0,1)',
				color4: 'rgba(220,0,0,1)',
				color5: 'rgba(0,105,0,1)',
				color6: 'rgba(0,0,255,1)'
			},
			orientation: {
				rotateX: -15,
				rotateY: -25,
				rotateZ: 0
			},
			cutStyle: 'radius',
			cutRadius: '10px'
		}
	};
	var cube = new RubicsCube(cubeOptions);
}

function RubicsCube(opt) {
	// BASE OPTIONS AND VARIABLES
	var visualCoords = false;
	var animationSpeed = '0.3s';

	var elem = opt.element;

	var color0 = opt.styles.colors.color0;
	var color1 = opt.styles.colors.color1;
	var color2 = opt.styles.colors.color2;
	var color3 = opt.styles.colors.color3;
	var color4 = opt.styles.colors.color4;
	var color5 = opt.styles.colors.color5;
	var color6 = opt.styles.colors.color6;

	var borderSize = '8px';
	var borderType = 'solid';
	var borderColor = 'black';

	var cutStyle = opt.styles.cutStyle;
	var cutRadius = opt.styles.cutRadius;
	var step = opt.sizeStep;

	var externalFlatsOpacity = opt.styles.opacity.external;
	var internalFlatsOpacity = opt.styles.opacity.internal;
	var lightSelector = opt.styles.lightSelector;
	var lightOptions = opt.styles.lightOptions;

	var startX = opt.styles.orientation.rotateX;
	var startY = opt.styles.orientation.rotateY;
	var startZ = opt.styles.orientation.rotateZ;

	var mouseSens = 2;
	var cutSens = 7;
	var radian = 180;
	var quarterTurn = 90;
	var fullTurn = quarterTurn * 4;
	var rotateType = opt.rotateType;

	var wrapper;

	var rotateObj = {};
	var sideSelection = {};
	var rotateSide = {};
	var lastRotation = {};

	var CC = 0;

	// RUBIKS CUBE CREATING	
	create3dWrapper();
	createPieces();
	applyStyles();

	// EVENTS FOR CUBE AND SIDES ROTATION
	document.addEventListener('mousedown', rotateCube2d);
	elem.addEventListener('mouseover', lightSide);
	elem.addEventListener('mouseout', unlightSide);
	elem.addEventListener('mousecheck', lightSide);
	elem.addEventListener('mousedown', startSideRotation);
	elem.addEventListener('rotate', doSideRotation);


	// THIS FUNCTION CHECKS SIDES, WHICH USER IS GOING TO ROTATE,
	// AND RUN MOUSEMOVE EVENT, IF USER MOVE MOUSE FOR A PARTICULAR
	// DISTANCE IN A PARTICULAR DIRECTIONS
	function startSideRotation(e) {
		document.addEventListener('mouseup', endSideRotation);
		var target = e.target;
		var piece = target.closest('.piece');

		turnAnimation(false);

		rotateSide.currentPiece = piece;
		rotateSide.currentSide = target.dataset.attach;
		rotateSide.startX = e.clientX;
		rotateSide.startY = e.clientY;
		rotateSide.extreme = [];
		rotateSide.coords = [];

		for (var key in sideSelection) {
			var piecesOfSide = [];
			var extremeFlats = [];
			var isEdges = false;

			for (var i = 0; i < sideSelection[key].length; i++) {
				if (sideSelection[key][i].classList.contains(rotateSide.currentSide)) {
					piecesOfSide.push(sideSelection[key][i]);
					if (sideSelection[key][i].classList.contains('edge')) isEdges = true;
				}
			}

			for (var i = 0; i < piecesOfSide.length; i++) {
				var extremeEdge = piecesOfSide[i];
				var lookingFor = isEdges ? 'edge' : 'corner';
				if (extremeEdge.classList.contains(lookingFor)) {
					var extremeEdgeFlatCollection = extremeEdge.getElementsByClassName('external');
					for (var r = 0; r < extremeEdgeFlatCollection.length; r++) {
						if (extremeEdgeFlatCollection[r].dataset.attach == rotateSide.currentSide) {
							var extremeEdgeFlat = extremeEdgeFlatCollection[r];
						}
					}
					extremeFlats.push(extremeEdgeFlat);
				}
			}
			rotateSide.extreme.push(extremeFlats);
		}

		for (var i = 0; i < rotateSide.extreme.length; i++) {
			var currentFlatCoords = [];
			for (var k = 0; k < rotateSide.extreme[i].length; k++) {
				var currentFlat = rotateSide.extreme[i][k];
				var currentFlatMark = document.createElement('div');
				currentFlatMark.classList.add('mark');
				currentFlatMark.style.width = '1px';
				currentFlatMark.style.height = '1px';
				currentFlatMark.style.display = 'block';
				currentFlatMark.style.position = 'relative';
				currentFlatMark.style.left = '50%';
				currentFlatMark.style.top = '50%';
				currentFlatMark.style.visibility = 'hidden';
				currentFlat.appendChild(currentFlatMark);

				var xPos = Math.round(currentFlatMark.getBoundingClientRect().left);
				var yPos = Math.round(currentFlatMark.getBoundingClientRect().top);
				
				currentFlatCoords.push(xPos);
				currentFlatCoords.push(yPos);
				currentFlatMark.remove();

				if (visualCoords) {
					(function showCoords() {
						var newDiv = document.createElement('div');
						newDiv.classList.add('coords');
						newDiv.style.left = xPos + 'px';
						newDiv.style.top = yPos + 'px';

						if (i === 0) var p = 'P1, ';
						else var p = 'P2, ';

						if (k == 0) {
							var x = '<br>x1: ';
							var y = ';<br>y1: ';
						}else{
							var x = '<br>x2: ';
							var y = ';<br>y2: ';
						}

						newDiv.innerHTML = p + x + xPos + y + yPos;
						document.body.appendChild(newDiv);
					})();
				}

			}
			rotateSide.coords.push(currentFlatCoords);
		}

		document.addEventListener('mousemove', checkRotationSide);
		elem.removeEventListener('mouseout', unlightSide);
		elem.removeEventListener('mouseover', lightSide);
		e.preventDefault();
	}

	// THIS EVENT CHECK, WHAT SIDE EXACTLI USER TRY TO ROTATE,
	// (AXIS, DIRECTION, AND OTHER) AND START ROTATION FUNCTION
	function checkRotationSide(e) {
		elem.removeEventListener('mousedown', startSideRotation);
		var extreme = 50;	//extreme sens
		rotateSide.currentX = e.clientX;
		rotateSide.currentY = e.clientY;

		var moveX = Math.abs(rotateSide.startX - rotateSide.currentX);
		var moveY = Math.abs(rotateSide.startY - rotateSide.currentY);

		if (moveX > extreme || moveY > extreme) {
			var a1 = rotateSide.currentX - rotateSide.startX;
			var a2 = rotateSide.currentY - rotateSide.startY;
			var b1 = rotateSide.coords[0][2] - rotateSide.coords[0][0];
			var b2 = rotateSide.coords[0][3] - rotateSide.coords[0][1];
			var c1 = rotateSide.coords[1][2] - rotateSide.coords[1][0];
			var c2 = rotateSide.coords[1][3] - rotateSide.coords[1][1];
			var cosA1 = ((a1 * b1) + (a2 * b2)) / ((Math.sqrt(Math.pow(a1, 2) + Math.pow(a2, 2))) * (Math.sqrt(Math.pow(b1, 2) + Math.pow(b2, 2)))) * 100;
			var cosA2 = ((a1 * c1) + (a2 * c2)) / ((Math.sqrt(Math.pow(a1, 2) + Math.pow(a2, 2))) * (Math.sqrt(Math.pow(c1, 2) + Math.pow(c2, 2)))) * 100;

			var sidesNames = [];
			for (var key in sideSelection) sidesNames.push(key);
			rotateSide.sidesNames = sidesNames;

			if (Math.abs(cosA1) > (100 - cutSens) && Math.abs(cosA1) < (100 + cutSens)) {
				var sideName = rotateSide.sidesNames[0];
				var rotateAxis = findAxis(sideName);
				var turn = phantomRotation(cosA1, rotateSide.extreme[0], rotateSide.coords[0], rotateAxis);
			}else if (Math.abs(cosA2) > (100 - cutSens) && Math.abs(cosA1) < (100 + cutSens)) {
				var sideName = rotateSide.sidesNames[1];
				var rotateAxis = findAxis(sideName);
				var turn = phantomRotation(cosA2, rotateSide.extreme[1], rotateSide.coords[1], rotateAxis);
			}else	return;

			document.removeEventListener('mousemove', checkRotationSide);
			elem.removeEventListener('mouseup', endSideRotation);

			var rotateEvent = new CustomEvent('rotate', {
				bubbles: true,
				cancelable: true,
				detail: {
					axis: rotateAxis,
					direction: turn,
					side: sideName
				}
			});
			elem.dispatchEvent(rotateEvent);

			function findAxis(side) {
				if (side == 'u' || side == 'd') return 'Y';
				if (side == 'l' || side == 'r') return 'X';
				if (side == 'f' || side == 'b') return 'Z';
				if (side.length == 4) {
					if (!~side.indexOf('u')) return 'Y';
					if (!~side.indexOf('l')) return 'X';
					if (!~side.indexOf('f')) return 'Z';
				}
			}

			function phantomRotation(cos, extremePieces, extremeCoords, axis) {
				var extremePiece1 = extremePieces[0].closest('.piece');
				var extremePiece2 = extremePieces[1].closest('.piece');

				if (cos > 0) {
					var phantomPiece = extremePiece1.cloneNode(true);
					var extremePiece = extremePiece1;
					var currentExtremeCoords = [];
					currentExtremeCoords.push(extremeCoords[2]);
					currentExtremeCoords.push(extremeCoords[3]);
				}else if (cos < 0) {
					var phantomPiece = extremePiece2.cloneNode(true);
					var extremePiece = extremePiece2;
					var currentExtremeCoords = [];
					currentExtremeCoords.push(extremeCoords[0]);
					currentExtremeCoords.push(extremeCoords[1]);
				}

				phantomPiece.classList.add('clone');
				phantomPiece.style.visibility = 'hidden';
				extremePiece1.parentNode.appendChild(phantomPiece);

				rotatePiece(phantomPiece, axis, true);

				rotateSide.classChange = phantomPiece.dataset.attach;
				var controlCoords = extractControlCoords(phantomPiece);
				phantomPiece.remove();

				if (controlCoords[0] < (currentExtremeCoords[0] + 10) &&
					controlCoords[0] >= (currentExtremeCoords[0] - 10) &&
					controlCoords[1] < (currentExtremeCoords[1] + 10) &&
					controlCoords[1] >= (currentExtremeCoords[1] - 10) ) {

					return true;
				}else	return false;

				function extractControlCoords(piece) {
					var piece = piece;
					var flats = piece.getElementsByClassName('external');

					if (flats.length == 3) {
						for (var i = 0; i < flats.length; i++) {
							if (flats[i].dataset.attach == sideName) continue;
							if (flats[i].dataset.attach == rotateSide.currentSide) continue;
							var controlFlat = flats[i];
						}
						var coords = takeCoordsOfCenter(controlFlat);
					}else if (flats.length == 2) {
						for (var i = 0; i < flats.length; i++) {
							if (flats[i].dataset.attach == rotateSide.currentSide) continue;
							var controlFlat = flats[i];
						}
						var coords = takeCoordsOfCenter(controlFlat);
					}else{
						console.log('have no pieces');
					}
					return coords;
				}
			}

			elem.addEventListener('mouseup', returnMouseUpEvent);
		}
		e.preventDefault();
	}

	// THIS FUNCTION ROTATE CURRENT ONE PIECE WITH PARAMS
	function rotatePiece(piece, axis, dir) {
		var params = executeAxis(piece);
		if (axis == 'X') dir ? params[0] += 90 : params[0] -= 90;
		else if (axis == 'Y') dir ? params[1] += 90 : params[1] -= 90;
		else if (axis == 'Z') dir ? params[2] += 90 : params[2] -= 90;
		piece.style.transform = constructStyle(params);
	}

	// THIS FUNCTION BEGIN ROTATION OF PARTICULAR SIDE
	function doSideRotation(e) {
		elem.removeEventListener('mousedown', startSideRotation);

		var actualFlats = elem.querySelectorAll('.light');
		applyLight(actualFlats, lightSelector, '');
		turnAnimation(true);
		var side = e.detail.side;
		var axis = e.detail.axis;
		var direction = e.detail.direction;
		var currentSide = sideSelection[side];

		for (var i = 0; i < currentSide.length; i++) {
			var currentPiece = currentSide[i];
			rotatePiece(currentPiece, axis, direction);
		}

		lastRotation.side = side;
		lastRotation.axis = axis;
		lastRotation.classChange = rotateSide.classChange;
		lastRotation.currentSide = rotateSide.currentSide;
		lastRotation[side] = sideSelection[side];
		changePiecesId(side, axis, rotateSide.classChange, rotateSide.currentSide, sideSelection[side]);
		lastRotation.firstLaunch = true;
		setTimeout(function() {
			turnAnimation();
			elem.addEventListener('mousedown', startSideRotation);
			var event = new MouseEvent('mousecheck', {
				bubbles: true,
				cancelable: true,
				clientX: e.clientX,
				clientY: e.clientY
			});
			elem.dispatchEvent(event);
		}, (parseFloat(animationSpeed) * 950));
	}

	// CHANGE PIECE AND FLATS ID AFTER ROTATION,
	// ALSO CHANGE COLORS-ID AFTER ROTATION
	function changePiecesId(side, axis, classChange, currentSide, selectedSide, back) {
		var idMatrix, idSecond, idFirst;
		idMatrix = idSecond = idFirst = '';

		if (axis == 'Y') idMatrix = 'frbl';
		else if (axis == 'X') idMatrix = 'fubd';
		else if (axis == 'Z') idMatrix = 'urdl';

		if (classChange.length == 3) {
			for (var i = 0; i < classChange.length; i++) {
				var currentSymb = classChange.slice(i, i + 1);
				if (currentSymb == currentSide) {
					idSecond = currentSymb;
					continue;
				}
				if (currentSymb == side) continue;
				idFirst = currentSymb;
			}
		}else if (classChange.length == 2) {
			for (var i = 0; i < classChange.length; i++) {
				var currentSymb = classChange.slice(i, i + 1);
				if (currentSymb == currentSide) {
					idSecond = currentSymb;
					continue;
				}
				idFirst = currentSymb;
			}
		}else{
			console.log('Error. ClassChange is not correct!');
		}

		var numberOfSides = 4;
		var iterator = 0;
		var nextSymb;

		if (idMatrix.indexOf(idFirst) != idMatrix.length - 1) {
			nextSymb = idMatrix.slice(idMatrix.indexOf(idFirst) + 1, idMatrix.indexOf(idFirst) + 2);
		}else{
			nextSymb = idMatrix.slice(0, 1);
		}

		if (nextSymb == idSecond) back ? iterator = -1 : iterator = 1;
		else back ? iterator = 1 : iterator = -1;

		var pos = idMatrix.indexOf(idFirst);
		var curId = 'n';
		var newId = '';

		for (var i = 0; i <= numberOfSides; i++) {
			if (pos > idMatrix.length - 1) pos = 0;
			if (pos < 0) pos = idMatrix.length - 1;

			newId = idMatrix.substr(pos, 1);
			if (i == 4) newId = 'n';

			for (var k = 0; k < selectedSide.length; k++) {
				var workWith = selectedSide[k];

				if (workWith.classList.contains(newId)) {
					workWith.classList.remove(newId);
					workWith.classList.add(curId);
					var extFlat = workWith.getElementsByClassName('external');

					for (var w = 0; w < extFlat.length; w++) {
						if (extFlat[w].dataset.attach == newId) {
							extFlat[w].dataset.attach = curId;
						}
					}
					var attach = workWith.dataset.attach;
					var newAttach = '';

					for (var q = 0; q < attach.length; q++) {
						if (attach.slice(q, q+1) == newId) {
							newAttach += curId;
							continue;
						}
						newAttach += attach.slice(q, q+1);
					}
					workWith.dataset.attach = newAttach;
					workWith.getElementsByClassName('axis')[0].classList.remove(newId);
					workWith.getElementsByClassName('axis')[0].classList.add(curId);
				}
			}
			curId = newId;
			pos = pos - iterator;
		}

		if (back) {

			if (iterator == -1) {
				var s1 = idMatrix.slice(0, 1);
				var s2 = idMatrix.slice(1, 2);
				var s3 = idMatrix.slice(2, 3);
				var s4 = idMatrix.slice(3);
			}else if (iterator == 1) {
				var s4 = idMatrix.slice(0, 1);
				var s3 = idMatrix.slice(1, 2);
				var s2 = idMatrix.slice(2, 3);
				var s1 = idMatrix.slice(3);
			}

			var col1, col2, col3, col4, col5, col6, col7, col8, col9, col10, col11, col12, col13, col14, col15, col16, col17, col18, col19, col20;
			col1 = col2 = col3 = col4 = col5 = col6 = col7 = col8 = col9 = col10 = col11 = col12 = col13 = col14 = col15 = col16 = col17 = col18 = col19 = col20 = '';

			for (var i = 0; i < selectedSide.length; i++) {
				var curPiece = selectedSide[i];
				if (curPiece.classList.contains(s1) && curPiece.classList.contains(s2)) {
					var curFlats = curPiece.getElementsByClassName('external');
					for (var j = 0; j < curFlats.length; j++) {
						if (curFlats[j].classList.contains(s1)) {
							col1 = curFlats[j].dataset.color;
							curFlats[j].id = 'f1';
						}else if (curFlats[j].classList.contains(s2)){
							col2 = curFlats[j].dataset.color;
							curFlats[j].id = 'f2';
						}else{
							col13 = curFlats[j].dataset.color;
							curFlats[j].id = 'f13';
						}
					}
				}else if (curPiece.classList.contains(s2) && curPiece.classList.contains(s3)) {
					var curFlats = curPiece.getElementsByClassName('external');
					for (var j = 0; j < curFlats.length; j++) {
						if (curFlats[j].classList.contains(s2)) {
							col3 = curFlats[j].dataset.color;
							curFlats[j].id = 'f3';
						}else if (curFlats[j].classList.contains(s3)){
							col4 = curFlats[j].dataset.color;
							curFlats[j].id = 'f4';
						}else{
							col14 = curFlats[j].dataset.color;
							curFlats[j].id = 'f14';
						}
					}
				}else if (curPiece.classList.contains(s3) && curPiece.classList.contains(s4)) {
					var curFlats = curPiece.getElementsByClassName('external');
					for (var j = 0; j < curFlats.length; j++) {
						if (curFlats[j].classList.contains(s3)) {
							col5 = curFlats[j].dataset.color;
							curFlats[j].id = 'f5';
						}else if (curFlats[j].classList.contains(s4)){
							col6 = curFlats[j].dataset.color;
							curFlats[j].id = 'f6';
						}else{
							col15 = curFlats[j].dataset.color;
							curFlats[j].id = 'f15';
						}
					}
				}else if (curPiece.classList.contains(s4) && curPiece.classList.contains(s1)) {
					var curFlats = curPiece.getElementsByClassName('external');
					for (var j = 0; j < curFlats.length; j++) {
						if (curFlats[j].classList.contains(s4)) {
							col7 = curFlats[j].dataset.color;
							curFlats[j].id = 'f7';
						}else if (curFlats[j].classList.contains(s1)){
							col8 = curFlats[j].dataset.color;
							curFlats[j].id = 'f8';
						}else{
							col16 = curFlats[j].dataset.color;
							curFlats[j].id = 'f16';
						}
					}
				}

				if (side.length > 1) {
					if (curPiece.classList.contains(s1) && curPiece.classList.contains('center')) {
						var curFlats = curPiece.querySelector('.external');
						col9 = curFlats.dataset.color;
						curFlats.id = 'f9';
					}else if (curPiece.classList.contains(s2) && curPiece.classList.contains('center')) {
						var curFlats = curPiece.querySelector('.external');
						col10 = curFlats.dataset.color;
						curFlats.id = 'f10';
					}else if (curPiece.classList.contains(s3) && curPiece.classList.contains('center')) {
						var curFlats = curPiece.querySelector('.external');
						col11 = curFlats.dataset.color;
						curFlats.id = 'f11';
					}else if (curPiece.classList.contains(s4) && curPiece.classList.contains('center')) {
						var curFlats = curPiece.querySelector('.external');
						col12 = curFlats.dataset.color;
						curFlats.id = 'f12';
					}
				}else{
					if (curPiece.classList.contains(s1) && curPiece.classList.contains('corner')) {
						var curFlats = curPiece.getElementsByClassName('external');
						for (var z = 0; z < curFlats.length; z++) {
							if (curFlats[z].classList.contains(side)){
								col17 = curFlats[z].dataset.color;
								curFlats[z].id = 'f17';
							}else{
								col9 = curFlats[z].dataset.color;
								curFlats[z].id = 'f9';
							}
						}
					}else if (curPiece.classList.contains(s2) && curPiece.classList.contains('corner')) {
						var curFlats = curPiece.getElementsByClassName('external');
						for (var z = 0; z < curFlats.length; z++) {
							if (curFlats[z].classList.contains(side)){
								col18 = curFlats[z].dataset.color;
								curFlats[z].id = 'f18';
							}else{
								col10 = curFlats[z].dataset.color;
								curFlats[z].id = 'f10';
							}
						}
					}else if (curPiece.classList.contains(s3) && curPiece.classList.contains('corner')) {
						var curFlats = curPiece.getElementsByClassName('external');
						for (var z = 0; z < curFlats.length; z++) {
							if (curFlats[z].classList.contains(side)){
								col19 = curFlats[z].dataset.color;
								curFlats[z].id = 'f19';
							}else{
								col11 = curFlats[z].dataset.color;
								curFlats[z].id = 'f11';
							}
						}
					}else if (curPiece.classList.contains(s4) && curPiece.classList.contains('corner')) {
						var curFlats = curPiece.getElementsByClassName('external');
						for (var z = 0; z < curFlats.length; z++) {
							if (curFlats[z].classList.contains(side)){
								col20 = curFlats[z].dataset.color;
								curFlats[z].id = 'f20';
							}else{
								col12 = curFlats[z].dataset.color;
								curFlats[z].id = 'f12';
							}
						}
					}
				}
			}

			var flat1 = document.getElementById('f3');
			var flat2 = document.getElementById('f4');
			var flat3 = document.getElementById('f5');
			var flat4 = document.getElementById('f6');
			var flat5 = document.getElementById('f7');
			var flat6 = document.getElementById('f8');
			var flat7 = document.getElementById('f1');
			var flat8 = document.getElementById('f2');

			var flat9 = document.getElementById('f9');
			var flat10 = document.getElementById('f10');
			var flat11 = document.getElementById('f11');
			var flat12 = document.getElementById('f12');

			flat1.dataset.color = col1;
			flat2.dataset.color = col2;
			flat3.dataset.color = col3;
			flat4.dataset.color = col4;
			flat5.dataset.color = col5;
			flat6.dataset.color = col6;
			flat7.dataset.color = col7;
			flat8.dataset.color = col8;

			flat9.dataset.color = col12;
			flat10.dataset.color = col9;
			flat11.dataset.color = col10;
			flat12.dataset.color = col11;

			colorizeFlats([flat1,flat2,flat3,flat4,flat5,flat6,flat7,flat8,flat9,flat10,flat11,flat12]);

			if (side.length == 1) {
				var flat13 = document.getElementById('f13');
				var flat14 = document.getElementById('f14');
				var flat15 = document.getElementById('f15');
				var flat16 = document.getElementById('f16');

				var flat17 = document.getElementById('f17');
				var flat18 = document.getElementById('f18');
				var flat19 = document.getElementById('f19');
				var flat20 = document.getElementById('f20');

				flat13.dataset.color = col16;
				flat14.dataset.color = col13;
				flat15.dataset.color = col14;
				flat16.dataset.color = col15;

				flat17.dataset.color = col20;
				flat18.dataset.color = col17;
				flat19.dataset.color = col18;
				flat20.dataset.color = col19;
				
				colorizeFlats([flat13,flat14,flat15,flat16,flat17,flat18,flat19,flat20]);
			}
		}
	}

	// ENABLE OR DISABLE ANIMATION (NEEDED, WHEN COLORS IS CHANGES,
	// AND CSS OPTIONS TOO)
	function turnAnimation(enable) {
		var pieces = elem.getElementsByClassName('piece');
		
		for (var i = 0; i < pieces.length; i++) {
			var currentPiece = pieces[i];

			if (enable) {
				currentPiece.style.transitionTimingFunction = 'linear';
				currentPiece.style.transitionDuration = animationSpeed;
			}else{
				currentPiece.style.transitionTimingFunction = '';
				currentPiece.style.transitionDuration = '';
				normalizeAxis(currentPiece);

				function normalizeAxis(rotAxis) {
					var rots = executeAxis(rotAxis);
					if (rots[0] != 0 || rots[1] != 0 || rots[2] != 0) {
						rotAxis.style.transform = constructStyle([0,0,0]);
					}
				}
			}
		}

		if (lastRotation.firstLaunch) {
			changePiecesId(lastRotation.side, lastRotation.axis, lastRotation.classChange, lastRotation.currentSide, lastRotation[lastRotation.side], true);
			lastRotation.firstLaunch = false;
		}
	}

	// TAKE VALUES OF TRANSFORM CSS OPTIONS
	function executeAxis(piece) {
		var params = piece.style.transform.split('(');
		var rotX = parseInt(params[1]);
		var rotY = parseInt(params[2]);
		var rotZ = parseInt(params[3]);
		var result = [rotX, rotY, rotZ];
		return result;
	}

	// SET UP NEW TRANSFORM VALUES
	function constructStyle(styles) {
		var result = 'rotateX(' + styles[0] + 'deg) rotateY(' + styles[1] + 'deg) rotateZ(' + styles[2] + 'deg)';
		return result;
	}


	function returnMouseUpEvent(e) {
		elem.removeEventListener('mouseup', returnMouseUpEvent);
		elem.addEventListener('mouseup', endSideRotation);
	}

	// FINISH ROTATION, AND RESTORE BASE OPTIONS, EVENTS AND VALUES
	function endSideRotation(e) {
		var coordsElems = document.getElementsByClassName('coords');

		for (var i = 0; i < coordsElems.length;) coordsElems[i].remove();

		elem.addEventListener('mousedown', startSideRotation);
		elem.addEventListener('mouseover', lightSide);
		elem.addEventListener('mouseout', unlightSide);
		document.removeEventListener('mousemove', checkRotationSide);
		document.removeEventListener('mouseup', endSideRotation);

		rotateSide = {};
		sideSelection = {};

		var event = new MouseEvent('mousecheck', {
			bubbles: true,
			cancelable: true,
			clientX: e.clientX,
			clientY: e.clientY
		});
		elem.dispatchEvent(event);
	}

	// TAKE COORDS OF FLAT (BY CREATING TEMP LITTLE ELEMENT IN CENTER OF FLAT)
	function takeCoordsOfCenter(target) {
		var currentFlatMark = document.createElement('div');
		currentFlatMark.classList.add('mark');
		currentFlatMark.style.width = '1px';
		currentFlatMark.style.height = '1px';
		currentFlatMark.style.display = 'block';
		currentFlatMark.style.position = 'relative';
		currentFlatMark.style.left = '50%';
		currentFlatMark.style.top = '50%';
		currentFlatMark.style.visibility = 'hidden';
		target.appendChild(currentFlatMark);

		var xPos = Math.round(currentFlatMark.getBoundingClientRect().left);
		var yPos = Math.round(currentFlatMark.getBoundingClientRect().top);
		var coords = [];
		coords.push(xPos);
		coords.push(yPos);
		currentFlatMark.remove();

		return coords;
	};


	// DISPLAY SELECTED SIDES OF RUBIKS CUBE BY CSS STYLES
	function lightSide(e) {
		var target = e.target;

		if (e.type == 'mousecheck') {
			var event = new MouseEvent('mouseout', {
				bubbles: true,
				cancelable: true
			});
			elem.dispatchEvent(event);
			target = document.elementFromPoint(e.clientX, e.clientY);

			if (!target) return;
		}
		if (!target.closest('.external')) return false;
		else target = target.closest('.external');

		var currentPiece = target.closest('.piece');
		var currentAttach = target.dataset.attach;
		var currentSides = [];
		var tempAttach = currentPiece.dataset.attach.split('');

		if (currentPiece.classList.contains('edge')) {
			for (var i = 0; i < tempAttach.length; i++) {
				if (tempAttach[i] != currentAttach) {
					sideSelection[tempAttach[i]] = doSelectionFromPieces(tempAttach[i]);
					currentSides.push(sideSelection[tempAttach[i]]);
				}
			}
			applyLight(currentSides, lightSelector, lightOptions);
		}else if (currentPiece.classList.contains('corner')) {
			for (var i = 0; i < tempAttach.length; i++) {
				if (tempAttach[i] != currentAttach) {
					sideSelection[tempAttach[i]] = doSelectionFromPieces(tempAttach[i]);
					currentSides.push(sideSelection[tempAttach[i]]);
				}else{
					getMiddleSide(tempAttach);
				}
			}
			applyLight(currentSides, lightSelector, lightOptions);
		}else if (currentPiece.classList.contains('center')) {
			if (tempAttach[0] == 'f' || tempAttach[0] == 'b') {
				getMiddleSide(['f', 'r']);
				getMiddleSide(['f', 'u']);
			}else if (tempAttach[0] == 'u' || tempAttach[0] == 'd') {
				getMiddleSide(['u', 'f']);
				getMiddleSide(['u', 'r']);
			}else if (tempAttach[0] == 'l' || tempAttach[0] == 'r') {
				getMiddleSide(['l', 'u']);
				getMiddleSide(['l', 'f']);
			}
			applyLight(currentSides, lightSelector, lightOptions);
		}


		function getMiddleSide(middleMarks) {
			var middleSide = '';
			for (var k = 0; k < middleMarks.length; k++) {
				if (middleMarks[k] == 'l' || middleMarks[k] == 'r') {
					middleSide += 'lr';
				}else if (middleMarks[k] == 'f' || middleMarks[k] == 'b') {
					middleSide += 'fb';
				}else if (middleMarks[k] == 'u' || middleMarks[k] == 'd') {
					middleSide += 'ud';
				}
			}

			var removedSides = [];

			if (!~middleSide.indexOf('f')){
				removedSides.push('f')
				removedSides.push('b');
			}else if (!~middleSide.indexOf('l')) {
				removedSides.push('l')
				removedSides.push('r');
			}else if (!~middleSide.indexOf('u')) {
				removedSides.push('u')
				removedSides.push('d');
			}

			var middleSideSelection = doSelectionFromPieces();
			for (var z = 0; z < removedSides.length; z++) {
				middleSideSelection = doSelectionFromPieces(removedSides[z], middleSideSelection, true);
			}
			sideSelection[middleSide] = middleSideSelection;
			currentSides.push(sideSelection[middleSide]);
		}
	}

	function unlightSide(e) {
		var target = e.target;
		var actualFlats = elem.querySelectorAll('.light');
		applyLight(actualFlats, lightSelector, '');
		sideSelection = {};
	}

	function applyLight(sides, selector, option) {
		if (option) {
			for (var i = 0; i < sides.length; i++) {
				switchTheLight(doFlatsSelection(sides[i]));
			}
		}else{
			switchTheLight(sides);
		}
		function switchTheLight(elements) {
			for (var k = 0; k < elements.length; k++) {
				elements[k].style[selector] = option;
				option ? elements[k].classList.add('light') : elements[k].classList.remove('light');
			}
		}
	}

	function doFlatsSelection(pieces) {
		var result = [];
		for (var i = 0; i < pieces.length; i++) {
			var allFlats = pieces[i].querySelectorAll('.external');
			for (var k = 0; k < allFlats.length; k++) {
				result.push(allFlats[k]);
			}
		}
		return result;
	}

	function doSelectionFromPieces(selector, pieces, remove) {
		var result = [];
		if (!pieces) var pieces = elem.getElementsByClassName('piece');
		if (!selector) selector = 'piece';
		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i].classList.contains(selector)) {
				if (!remove) result.push(pieces[i]);
			}else{
				if (remove) result.push(pieces[i]);
			}
		}
		return result;
	}

	// START CUBE ROTATION (AT ALL)
	function rotateCube2d(e) {
		var target = e.target;

		if (target.closest('#rubic')) {
			return false;
		}

		rotateObj.startClientX = e.clientX;
		rotateObj.startClientY = e.clientY;

		document.addEventListener('mouseup', endRotate2d);
		document.addEventListener('mousemove', trackMouseMove2d);
		elem.removeEventListener('mouseover', lightSide);
		elem.removeEventListener('mouseout', unlightSide);

		e.preventDefault();
	}

	// CHANGE CUBE POSITION, WHEN USER MOVE MOUSE
	function trackMouseMove2d(e) {
		var currentTransform = wrapper.style.transform.split('(');

		var currentRotateX = parseFloat(currentTransform[1]);
		var currentRotateY = parseFloat(currentTransform[2]);
		var currentRotateZ = parseFloat(currentTransform[3]);

		if (currentRotateX > quarterTurn && currentRotateX < quarterTurn * 3) {
			var rotateByY = e.clientX - rotateObj.startClientX;
		}else{
			var rotateByY = rotateObj.startClientX - e.clientX;
		}
		var rotateByX = e.clientY - rotateObj.startClientY;

		var newRotateX = currentRotateX - (rotateByX / mouseSens);
		var newRotateY = currentRotateY - (rotateByY / mouseSens);
		var newRotateZ = currentRotateZ;

		if (newRotateX > fullTurn) newRotateX -= fullTurn;
		if (newRotateY > fullTurn) newRotateY -= fullTurn;
		if (newRotateX < 0) newRotateX += fullTurn;
		if (newRotateY < 0) newRotateY += fullTurn;

		changePosition(newRotateX, newRotateY, 0);

		rotateObj.startClientX = e.clientX;
		rotateObj.startClientY = e.clientY;
	}

	function changePosition(axesX, axesY, axesZ) {
		wrapper.style.transform =
			'rotateX(' + axesX + 'deg) ' +
			'rotateY(' + axesY + 'deg) ' +
			'rotateZ(' + axesZ + 'deg)';
	}

	// RESTOR EVENTS AND OPTIONS
	function endRotate2d(e) {
		rotateObj = {};
		document.removeEventListener('mousemove', trackMouseMove2d);
		document.removeEventListener('mouseup', endRotate2d);
		elem.addEventListener('mouseover', lightSide);
		elem.addEventListener('mouseout', unlightSide);

		var event = new MouseEvent('mousecheck', {
			bubbles: true,
			cancelable: true,
			clientX: e.clientX,
			clientY: e.clientY
		});
		elem.dispatchEvent(event);
	}

	// CREATE WRAPPER FOR CUBE
	function create3dWrapper() {
		wrapper = document.createElement('div');
		wrapper.style.width = step + 'px';
		wrapper.style.height = step + 'px';
		wrapper.style.transformOrigin = '50% 50% 50%';
		wrapper.style.transform = 
			'rotateX(' + startX + 'deg) ' +
			'rotateY(' + startY + 'deg) ' +
			'rotateZ(' + startZ + 'deg)';
		elem.appendChild(wrapper);
	}

	// CREATE PIECES
	function createPieces() {
		createSinglePiece(['d']);
		createSinglePiece(['d', 'b']);
		createSinglePiece(['d', 'f']);
		createSinglePiece(['d', 'l']);
		createSinglePiece(['d', 'r']);
		createSinglePiece(['d', 'b', 'l']);
		createSinglePiece(['d', 'b', 'r']);
		createSinglePiece(['d', 'f', 'l']);
		createSinglePiece(['d', 'f', 'r']);
		createSinglePiece(['u']);
		createSinglePiece(['u', 'f']);
		createSinglePiece(['u', 'b']);
		createSinglePiece(['u', 'l']);
		createSinglePiece(['u', 'r']);
		createSinglePiece(['u', 'b', 'l']);
		createSinglePiece(['u', 'b', 'r']);
		createSinglePiece(['u', 'f', 'l']);
		createSinglePiece(['u', 'f', 'r']);

		createSinglePiece(['b']);
		createSinglePiece(['b', 'l']);
		createSinglePiece(['b', 'r']);
		createSinglePiece(['f']);
		createSinglePiece(['f', 'l']);
		createSinglePiece(['f', 'r']);
		
		createSinglePiece(['l']);
		createSinglePiece(['r']);
	}

	function createSinglePiece(params) {
		var piece = document.createElement('div');
		var axis = document.createElement('div');
		piece.classList.add('piece');
		piece.dataset.attach = '';
		axis.classList.add('axis');

		piece.style.transformStyle = axis.style.transformStyle = 'preserve-3d';
		piece.style.position = axis.style.position = 'absolute';
		piece.style.transitionDuration = animationSpeed;
		piece.style.transitionTimingFunction = 'linear';
		piece.style.width = step + 'px';
		piece.style.height = step + 'px';
		piece.style.transformOrigin = '50% 50% 50%';
		piece.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)';

		axis.style.width = step + 'px';
		axis.style.height = step + 'px';
		axis.style.transformOrigin = '50% 50% 50%';

		switch (params.length) {
			case 3:
				piece.classList.add('edge');
				break;
			case 2:
				piece.classList.add('corner');
				break;
			case 1:
				if (params[0] !== 'c') {
					piece.classList.add('center');
				}
				break;
			default:
				break;
		}

		for(var i = 0; i < params.length; i++) {
			piece.classList.add(params[i]);
			piece.dataset.attach += params[i];
			axis.classList.add(params[i]);
		}

		piece.appendChild(axis);
		createFlats(axis);
		setAxis(axis);
		wrapper.appendChild(piece);
	}

	function createFlats(container) {
		var sides = ['u', 'd', 'l', 'r', 'f', 'b'];

		for (var i = 0; i < sides.length; i++) {
			var currentFlat = document.createElement('div');
			currentFlat.classList.add('flat');
			currentFlat.classList.add(sides[i]);
			currentFlat.dataset.attach = sides[i];
			currentFlat.style.width = step + 'px';
			currentFlat.style.height = step + 'px';
			currentFlat.style.position = 'absolute';
			container.appendChild(currentFlat);

			switch(sides[i]) {
				case ('u'):
					currentFlat.style.transform = 'rotateX(90deg) translateZ(' +(step / 2)+ 'px)';
					break;
				case('d'):
					currentFlat.style.transform = 'rotateX(-90deg) translateZ(' +(step / 2)+ 'px)';
					break;
				case ('l'):
					currentFlat.style.transform = 'rotateY(-90deg) translateZ(' +(step / 2)+ 'px)';
					break;
				case('r'):
					currentFlat.style.transform = 'rotateY(90deg) translateZ(' +(step / 2)+ 'px)';
					break;
				case ('f'):
					currentFlat.style.transform = 'translateZ(' +(step / 2)+ 'px)';
					break;
				case('b'):
					currentFlat.style.transform = 'translateZ(-' +(step / 2)+ 'px)';
					break;
				default:
					break;
			}

			if (container.closest('.piece').classList.contains(sides[i])) {
				currentFlat.dataset.color = sides[i];
				currentFlat.classList.add('external');
				currentFlat.style.opacity = externalFlatsOpacity;
			}else{
				currentFlat.dataset.color = 'n';
				currentFlat.removeAttribute('data-attach');
				currentFlat.style.opacity = internalFlatsOpacity;
			}
		}
	}

	function setAxis(container) {
		var posX = posY = posZ = 0;

		if (container.classList.contains('u')) posY = -step;
		if(container.classList.contains('d')) posY = step;
		if (container.classList.contains('l')) posX = -step;
		if(container.classList.contains('r')) posX = step;
		if (container.classList.contains('f')) posZ = step;
		if(container.classList.contains('b')) posZ = -step;

		container.style.transform = 'translate3d(' +posX+ 'px,' +posY+ 'px,' +posZ+ 'px)';
	}

	// APPLY COLORS FOR FLATS (BY COLOR-ID)
	function colorizeFlats(flats) {
		if (flats) {
			for (var i = 0; i < flats.length; i++) {
				if (flats[i].dataset.color == 'u') flats[i].style.backgroundColor = color1;
				else if (flats[i].dataset.color == 'd') flats[i].style.backgroundColor = color2;
				else if (flats[i].dataset.color == 'l') flats[i].style.backgroundColor = color3;
				else if (flats[i].dataset.color == 'r') flats[i].style.backgroundColor = color4;
				else if (flats[i].dataset.color == 'f') flats[i].style.backgroundColor = color5;
				else if (flats[i].dataset.color == 'b') flats[i].style.backgroundColor = color6;
				flats[i].id = '';
			}
		}else{
			var flats = elem.getElementsByClassName('flat');
			for (var i = 0; i < flats.length; i++) {
				if (flats[i].dataset.color == 'n') flats[i].style.backgroundColor = color0;
				else if (flats[i].dataset.color == 'u') flats[i].style.backgroundColor = color1;
				else if (flats[i].dataset.color == 'd') flats[i].style.backgroundColor = color2;
				else if (flats[i].dataset.color == 'l') flats[i].style.backgroundColor = color3;
				else if (flats[i].dataset.color == 'r') flats[i].style.backgroundColor = color4;
				else if (flats[i].dataset.color == 'f') flats[i].style.backgroundColor = color5;
				else if (flats[i].dataset.color == 'b') flats[i].style.backgroundColor = color6;
			}
		}
	}

	function applyStyles() {
		elem.style.perspective = '1000px';

		wrapper.classList.add('wrapper3d');
		wrapper.style.display = 'block';
		wrapper.style.width = step + 'px';
		wrapper.style.height = step + 'px';
		wrapper.style.transformStyle = 'preserve-3d';
		wrapper.style.position = 'relative';

		flats = elem.querySelectorAll('.flat');

		for (var i = 0; i < flats.length; i++) {
			var flatClass = flats[i].classList;
			if (cutStyle == 'radius') flats[i].style.borderRadius = cutRadius;
			flats[i].style.border = borderSize + ' ' + borderType + ' ' + borderColor;
			flats[i].style.transitionDuration = '0.2s';
			flats[i].style.transitionTimingFunction = 'ease';			
		}
		colorizeFlats();
	}
}