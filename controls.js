class ControlPanel {
    constructor(frame) {
        const self = this;
        this.state = 1;
        this.frame = frame;
        this.familiar_tag = document.getElementById("frame_container" + this.frame.containerTag);
        this.familiar_tag.insertAdjacentHTML("beforebegin", "<div id='tool_bar' style='display:flex; width: 100%; height:20px; border: 1px solid;'></div>")
        this.toolBar = document.getElementById("tool_bar");
        this.toolBar.insertAdjacentHTML("afterbegin", "<button id='hide_button'>hide panel</button>")
        this.familiar_tag.insertAdjacentHTML("beforeend", "<div id='controls_panel' style='background-color: rgb(40,40,40); color: rgb(240,255,240); display:flex; flex-direction : column; width:300px; overflow-y: auto; overflow-x: hidden;'></div>");
        this.htmlElement = document.getElementById("controls_panel");
        this.htmlElement.style.height = this.frame.canvas.canvas.offsetHeight + "px";
        console.log("height", this.frame.canvas.canvas.offsetHeight);
        window.addEventListener('resize', function () {
            self.htmlElement.style.height = self.frame.canvas.canvas.offsetHeight + "px";
        });
        this.hideButton = document.getElementById("hide_button");
        this.hideButton.addEventListener("click", function () {
            if (self.state == 1) {
                self.htmlElement.style.width = '0px';
                self.hideButton.textContent = "show panel";
                self.state = 0;
            } else {
                self.htmlElement.style.width = '300px';
                self.hideButton.textContent = "hide panel";
                self.state = 1;
            }
        });
        this.createConsole();
    }
    createConsole() {
        this.console = new Console(this.frame.frameId, this.toolBar);
    }

}

class Console {
    constructor(container_id, toolBar) {
        const self = this;
        this.containerTag = container_id;
        this.toolBar = toolBar;
        this.c = "rgb(200,255,200)";
        this.bc = "rgba(127,127,127,0.3)"
        this.fs = "14px";
        this.state = 1;
        this.container = document.getElementById(this.containerTag);
        this.container.insertAdjacentHTML("afterbegin", "<div id='console' style=' position: absolute; background-color:" + this.bc + "; color:" + this.c + "; font-size:" + this.fs + "; width: 100%; hight:auto; border: 1px solid gray;'></div>")
        this.console = document.getElementById("console");
        this.toolBar.insertAdjacentHTML("afterbegin", "<button id='console_hide_button' style=' position: relative;'>hide console</button>")
        this.fontSize(this.fs);
        this.color(this.c);
        this.hideButton = document.getElementById("console_hide_button");
        this.hideButton.addEventListener("click", function () {
            if (self.state == 1) {
                self.console.style.display = 'none';
                self.hideButton.textContent = "show console";
                self.state = 0;
            } else {
                self.console.style.display = 'block';
                self.hideButton.textContent = "hide console";
                self.state = 1;
            }
        });
    }
    error(e) {
        this.console.insertAdjacentHTML("afterbegin", "<div id='error' style='display:flex; color:rgb(255,64,64); font-size:20px; background-color:rgb(0,0,0); width: 100%; hight:auto;'></div>");
        this.displayError = document.getElementById("error");
        this.displayError.innerText += "Error: " + e.name + "\n" + e.message + e.stack;
        alert("There is an error in the code.\n" + e.name + "\n" + e.message + e.stack);
    }

    fontSize(fs) {
        this.console.style.fontSize = fs;
    }
    color(c) {
        this.console.style.color = c;
    }
}

class Display {
    constructor(name) {
        this.name = name;
        this.familiar_tag = document.getElementById("console");
        this.familiar_tag.insertAdjacentHTML("beforeEnd", "<pre id='" + this.name + "DisplayDiv' style='display:flex; z-index:20; position: relative; width: 100%; hight:auto;'></pre>")
        this.display = document.getElementById(this.name + "DisplayDiv");
        this.numberOfColumns = 1;
        this.fixed = 3;
        this.color(this.familiar_tag.style.color.valueOf());
        //console.log(window.getComputedStyle(this.familiar_tag).fontSize);
        this.fontSize(window.getComputedStyle(this.familiar_tag).fontSize);
    }
    log(value) {
        if (value instanceof Float32Array) {
            if (this.numberOfColumns == 0) {
                this.display.textContent = this.name + ": Float32Array(" + value.length + "): " + value;
            } else {
                this.display.textContent = this.name + ": Float32Array(" + value.length + "): ";
                for (let i = 0; i < value.length;) {
                    this.display.innerHTML += "<br>&nbsp;&nbsp;&nbsp;";
                    for (let j = 0; j < this.numberOfColumns; j++) {
                        const val = Number(value[i + j]).toFixed(this.fixed);
                        this.display.innerHTML += "[" + (i + j) + "]: " + val + " &nbsp;&nbsp;&nbsp; ";
                    }
                    i = i + this.numberOfColumns;
                }
            }

        } else if (value instanceof Uint16Array) {
            if (this.numberOfColumns == 0) {
                this.display.textContent = this.name + ": Uint16Array(" + value.length + "): " + value;
            } else {
                this.display.textContent = this.name + ": Uint16Array(" + value.length + "): ";
                for (let i = 0; i < value.length;) {
                    this.display.innerHTML += "<br>&nbsp;&nbsp;&nbsp;";
                    for (let j = 0; j < this.numberOfColumns; j++) {
                        const val = Number(value[i + j]);//.toFixed(this.fixed);
                        this.display.innerHTML += "[" + (i + j) + "]: " + val + " &nbsp;&nbsp;&nbsp; ";
                    }
                    i = i + this.numberOfColumns;
                }
            }

        }
        else if (Array.isArray(value)) {
            if (this.numberOfColumns == 0) {
                this.display.textContent = this.name + ": Array(" + value.length + "): " + value;
            } else {
                this.display.textContent = this.name + ": Array(" + value.length + "): ";
                for (let i = 0; i < value.length;) {
                    this.display.innerHTML += "<br>&nbsp;&nbsp;&nbsp;";
                    for (let j = 0; j < this.numberOfColumns; j++) {
                        const val = value[i + j];//).toFixed(this.fixed);
                        this.display.innerHTML += "[" + (i + j) + "]: " + val + " &nbsp;&nbsp;&nbsp; ";
                    }
                    i = i + this.numberOfColumns;
                }
            }
        } else {
            this.display.textContent = this.name + " : " + value;
        }
    }
    logComma(value) {
        let comma = ",&nbsp;";
        if (value instanceof Float32Array) {
            if (this.numberOfColumns == 0) {
                this.display.textContent = this.name + ": Float32Array(" + value.length + "): " + value;
            } else {
                this.display.textContent = this.name + ": Float32Array(" + value.length + "): ";
                for (let i = 0; i < value.length;) {
                    this.display.innerHTML += "<br>&nbsp;&nbsp;&nbsp;";
                    for (let j = 0; j < this.numberOfColumns; j++) {
                        const val = Number(value[i + j]).toFixed(this.fixed);
                        if (i + j == value.length - 1) {
                            comma = "";
                        }
                        this.display.innerHTML += val + comma;
                    }
                    i = i + this.numberOfColumns;
                }
            }

        } else if (value instanceof Uint16Array) {
            if (this.numberOfColumns == 0) {
                this.display.textContent = this.name + ": Uint16Array(" + value.length + "): " + value;
            } else {
                this.display.textContent = this.name + ": Uint16Array(" + value.length + "): ";
                for (let i = 0; i < value.length;) {
                    this.display.innerHTML += "<br>&nbsp;&nbsp;&nbsp;";
                    for (let j = 0; j < this.numberOfColumns; j++) {
                        const val = Number(value[i + j]);//.toFixed(this.fixed);
                        if (i + j == value.length - 1) {
                            comma = "";
                        }
                        this.display.innerHTML += val + comma;
                    }
                    i = i + this.numberOfColumns;
                }
            }

        }
        else if (Array.isArray(value)) {
            if (this.numberOfColumns == 0) {
                this.display.textContent = this.name + ": Array(" + value.length + "): " + value;
            } else {
                this.display.textContent = this.name + ": Array(" + value.length + "): ";
                for (let i = 0; i < value.length;) {
                    this.display.innerHTML += "<br>&nbsp;&nbsp;&nbsp;";
                    for (let j = 0; j < this.numberOfColumns; j++) {
                        const val = value[i + j];//).toFixed(this.fixed);
                        if (i + j == value.length - 1) {
                            comma = "";
                        }
                        this.display.innerHTML += val + comma;
                    }
                    i = i + this.numberOfColumns;
                }
            }
        } else {
            this.display.textContent = this.name + " : " + value;
        }
    }
    fontSize(fs) {
        this.display.style.fontSize = fs;
    }
    color(c) {
        this.display.style.color = c;
    }
}



class AmbientLightControls {
    constructor(o) {
        this.o = o;
    }
    create() {
        const self = this.o;
        this.o.panel_id = "ambientLightPanel";
        this.o.familiar_tag = document.getElementById('controls_panel');
        this.o.familiar_tag.insertAdjacentHTML("beforeend", "<div id='" + this.o.panel_id + "' style='display:flex; flex-direction: column; width:100%;'></div>");
        this.o.panel = document.getElementById(this.o.panel_id);
        ///////////////////////////////////////////////////////////////add display color and switch button
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display:flex;'><button id='onoff_ambient'>OFF</button><div id='ambientColorDisplay' style='border: 1px solid grey; display: flex; width: 100%;'>ambient color</div></div>");
        this.o.ambientColorDisplay = document.getElementById('ambientColorDisplay');
        this.o.ambientColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(this.o.color, this.o.intensity);
        this.o.onOffButton = document.getElementById('onoff_ambient');
        this.o.onOffButton.addEventListener('click', function () {
            if (self.state == 1) {
                self.state = 0;
                self.onOffButton.textContent = '.ON.';
            } else {
                self.state = 1;
                self.onOffButton.textContent = 'OFF';
            }
        });
        ///////////////////////////////////////////////////////////add ambient red color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ambientRed' style='width : 110px;'>ambientRed </label>\
        <input type='range' name='ambientRed' id='ambientRed' min='0.0' max='1.0' step='0.01' value="+ this.o.color[0] + ">\
        <span id='ambientRedValue' style='width : 24px;'></span></div>");
        this.o.inputControlRed = document.getElementById('ambientRed');
        this.o.displayRedValue = document.getElementById('ambientRedValue');
        this.o.displayRedValue.textContent = this.o.color[0];
        this.o.inputControlRed.addEventListener('input', function (event) {
            self.color[0] = event.target.value;
            self.displayRedValue.textContent = event.target.value;
            self.ambientColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.ambientColorDisplay, self.color, self.intensity);
        });
        ////////////////////////////////////////////////////////////add ambient green color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ambientGreen' style='width : 110px;'>ambientGreen</label>\
        <input type='range' name='ambientGreen' id='ambientGreen' min='0.0' max='1.0' step='0.01' value="+ this.o.color[1] + ">\
        <span id='ambientGreenValue' style='width : 24px;'></span></div>");
        this.o.inputControlGreen = document.getElementById('ambientGreen');
        this.o.displayGreenValue = document.getElementById('ambientGreenValue');
        this.o.displayGreenValue.textContent = this.o.color[1];
        this.o.inputControlGreen.addEventListener('input', function (event) {
            self.color[1] = event.target.value;
            self.displayGreenValue.textContent = event.target.value;
            self.ambientColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.ambientColorDisplay, self.color, self.intensity);
        });
        //////////////////////////////////////////////////////////////add ambient blue color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ambientBlue' style='width : 110px;'>ambientBlue</label>\
        <input type='range' name='ambientBlue' id='ambientBlue' min='0.0' max='1.0' step='0.01' value="+ this.o.color[2] + ">\
        <span id='ambientBlueValue' style='width : 24px;'></span></div>");
        this.o.inputControlBlue = document.getElementById('ambientBlue');
        this.o.displayBlueValue = document.getElementById('ambientBlueValue');
        this.o.displayBlueValue.textContent = this.o.color[2];
        this.o.inputControlBlue.addEventListener('input', function (event) {
            self.color[2] = event.target.value;
            self.displayBlueValue.textContent = event.target.value;
            self.ambientColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.ambientColorDisplay, self.color, self.intensity);
        });
        ///////////////////////////////////////////////////////////////add ambient intensity light control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ambientIntensity' style='width : 110px;'>ambientIntensity</label>\
        <input type='range' name='ambientIntensity' id='ambientIntensity' min='0.0' max='1.0' step='0.01' value="+ this.o.intensity + ">\
        <span id='ambientIntensityValue' style='width : 24px;'></span></div>");
        this.o.inputControlIntensity = document.getElementById('ambientIntensity');
        this.o.displayIntensityValue = document.getElementById('ambientIntensityValue');
        this.o.displayIntensityValue.textContent = this.intensity;
        this.o.inputControlIntensity.addEventListener('input', function (event) {
            self.intensity = event.target.value;
            self.displayIntensityValue.textContent = event.target.value;
            self.ambientColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.ambientColorDisplay, self.color, self.intensity);
        });

    }
}

class DirectionalLightControls {
    constructor(o) {
        this.o = o;
    }
    create() {
        const self = this.o;
        this.o.panel_id = "directionalLightPanel";
        this.o.familiar_tag = document.getElementById('controls_panel');
        this.o.familiar_tag.insertAdjacentHTML("beforeend", "<div id='" + this.o.panel_id + "' style='display:flex; flex-direction: column; width:100%;'></div>");
        this.o.panel = document.getElementById(this.o.panel_id);
        ///////////////////////////////////////////////////////////////add display color and switch button
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display:flex;'><button id='onoff_directional'>OFF</button><div id='directionalColorDisplay' style='border: 1px solid grey; display: flex; width: 100%;'>directional color</div></div>");
        this.o.directionalColorDisplay = document.getElementById('directionalColorDisplay');
        this.o.directionalColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(this.o.color, this.o.intensity);
        this.o.onOffButton = document.getElementById('onoff_directional');
        this.o.onOffButton.addEventListener('click', function () {
            if (self.state == 1) {
                self.state = 0;
                self.onOffButton.textContent = '.ON.';
            } else {
                self.state = 1;
                self.onOffButton.textContent = 'OFF';
            }
        });
        ///////////////////////////////////////////////////////////add directional red color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='directionalRed' style='width : 110px;'>directionalRed </label>\
        <input type='range' name='directionalRed' id='directionalRed' min='0.0' max='1.0' step='0.01' value="+ this.o.color[0] + ">\
        <span id='directionalRedValue' style='width : 24px;'></span></div>");
        this.o.inputControlRed = document.getElementById('directionalRed');
        this.o.displayRedValue = document.getElementById('directionalRedValue');
        this.o.displayRedValue.textContent = this.o.color[0];
        this.o.inputControlRed.addEventListener('input', function (event) {
            self.color[0] = event.target.value;
            self.displayRedValue.textContent = event.target.value;
            self.directionalColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.directionalColorDisplay, self.color, self.intensity);
        });
        ////////////////////////////////////////////////////////////add directional green color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='directionalGreen' style='width : 110px;'>directionalGreen</label>\
        <input type='range' name='directionalGreen' id='directionalGreen' min='0.0' max='1.0' step='0.01' value="+ this.o.color[1] + ">\
        <span id='directionalGreenValue' style='width : 24px;'></span></div>");
        this.o.inputControlGreen = document.getElementById('directionalGreen');
        this.o.displayGreenValue = document.getElementById('directionalGreenValue');
        this.o.displayGreenValue.textContent = this.o.color[1];
        this.o.inputControlGreen.addEventListener('input', function (event) {
            self.color[1] = event.target.value;
            self.displayGreenValue.textContent = event.target.value;
            self.directionalColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.directionalColorDisplay, self.color, self.intensity);
        });
        //////////////////////////////////////////////////////////////add directional blue color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='directionalBlue' style='width : 110px;'>directionalBlue</label>\
        <input type='range' name='directionalBlue' id='directionalBlue' min='0.0' max='1.0' step='0.01' value="+ this.o.color[2] + ">\
        <span id='directionalBlueValue' style='width : 24px;'></span></div>");
        this.o.inputControlBlue = document.getElementById('directionalBlue');
        this.o.displayBlueValue = document.getElementById('directionalBlueValue');
        this.o.displayBlueValue.textContent = this.o.color[2];
        this.o.inputControlBlue.addEventListener('input', function (event) {
            self.color[2] = event.target.value;
            self.displayBlueValue.textContent = event.target.value;
            self.directionalColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.directionalColorDisplay, self.color, self.intensity);
        });
        ///////////////////////////////////////////////////////////////add directional intensity light control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='directionalIntensity' style='width : 110px;'>directionalIntensity</label>\
        <input type='range' name='directionalIntensity' id='directionalIntensity' min='0.0' max='1.0' step='0.01' value="+ this.o.intensity + ">\
        <span id='directionalIntensityValue' style='width : 24px;'></span></div>");
        this.o.inputControlIntensity = document.getElementById('directionalIntensity');
        this.o.displayIntensityValue = document.getElementById('directionalIntensityValue');
        this.o.displayIntensityValue.textContent = this.o.intensity;
        this.o.inputControlIntensity.addEventListener('input', function (event) {
            self.intensity = event.target.value;
            self.displayIntensityValue.textContent = event.target.value;
            self.directionalColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.directionalColorDisplay, self.color, self.intensity);
        });

        ///////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////add vector X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='directional_X' style='width : 110px;'>directional_X </label>\
        <input type='range' name='directional_X' id='directional_X' min='-1.0' max='1.0' step='0.01' value="+ this.o.noNormalizedDirection[0] + ">\
        <span id='directional_XValue' style='width : 24px;'></span></div>");
        this.o.inputControldirectional_X = document.getElementById('directional_X');
        this.o.displaydirectional_XValue = document.getElementById('directional_XValue');
        this.o.displaydirectional_XValue.textContent = this.o.noNormalizedDirection[0];
        this.o.inputControldirectional_X.addEventListener('input', function (event) {
            self.displaydirectional_XValue.textContent = event.target.value;
            self.noNormalizedDirection[0] = event.target.value;
            var normalizedVector = normalize3(self.noNormalizedDirection);
            self.direction[0] = normalizedVector[0];
            self.direction[1] = normalizedVector[1];
            self.direction[2] = normalizedVector[2];
            self.normalized_directional_vectorDisplay.textContent = "normalized directional vector: [" + self.direction[0].toFixed(3) + "," + self.direction[1].toFixed(3) + "," + self.direction[2].toFixed(3) + "]";
        });
        ////////////////////////////////////////////////////////////add vector Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='directional_Y' style='width : 110px;'>directional_Y</label>\
        <input type='range' name='directional_Y' id='directional_Y' min='-1.0' max='1.0' step='0.01' value="+ this.o.noNormalizedDirection[1] + ">\
        <span id='directional_YValue' style='width : 24px;'></span></div>");
        this.o.inputControldirectional_Y = document.getElementById('directional_Y');
        this.o.displaydirectional_YValue = document.getElementById('directional_YValue');
        this.o.displaydirectional_YValue.textContent = this.o.noNormalizedDirection[1];
        this.o.inputControldirectional_Y.addEventListener('input', function (event) {
            self.displaydirectional_YValue.textContent = event.target.value;
            self.noNormalizedDirection[1] = event.target.value;
            var normalizedVector = normalize3(self.noNormalizedDirection);
            self.direction[0] = normalizedVector[0];
            self.direction[1] = normalizedVector[1];
            self.direction[2] = normalizedVector[2];
            self.normalized_directional_vectorDisplay.textContent = "normalized directional vector: [" + self.direction[0].toFixed(3) + "," + self.direction[1].toFixed(3) + "," + self.direction[2].toFixed(3) + "]";
        });
        //////////////////////////////////////////////////////////////add vector Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='directional_Z' style='width : 110px;'>directional_Z</label>\
        <input type='range' name='directional_Z' id='directional_Z' min='-1.0' max='1.0' step='0.01' value="+ this.o.noNormalizedDirection[2] + ">\
        <span id='directional_ZValue' style='width : 24px;'></span></div>");
        this.o.inputControldirectional_Z = document.getElementById('directional_Z');
        this.o.displaydirectional_ZValue = document.getElementById('directional_ZValue');
        this.o.displaydirectional_ZValue.textContent = this.o.noNormalizedDirection[2];
        this.o.inputControldirectional_Z.addEventListener('input', function (event) {
            self.displaydirectional_ZValue.textContent = event.target.value;
            self.noNormalizedDirection[2] = event.target.value;
            var normalizedVector = normalize3(self.noNormalizedDirection);
            self.direction[0] = normalizedVector[0];
            self.direction[1] = normalizedVector[1];
            self.direction[2] = normalizedVector[2];
            self.normalized_directional_vectorDisplay.textContent = "normalized directional vector: [" + self.direction[0].toFixed(3) + "," + self.direction[1].toFixed(3) + "," + self.direction[2].toFixed(3) + "]";
        });
        //////////////////////////////////////////////////////////////add nomalized direction vector display
        this.o.panel.insertAdjacentHTML("beforeend", "<div id='normalized_directional_vector' style='border: 1px solid grey;'>normalized directional vector</div>");
        this.o.normalized_directional_vectorDisplay = document.getElementById('normalized_directional_vector');
        this.o.normalized_directional_vectorDisplay.textContent = "normalized directional vector: [" + this.o.direction[0].toFixed(3) + "," + this.o.direction[1].toFixed(3) + "," + this.o.direction[2].toFixed(3) + "]";

    }
}

class PointLightControls {
    constructor(o) {
        this.o = o;
    }
    create(indexPoint) {
        const self = this.o;
        this.o.panel_id = "pointLightPanel_" + indexPoint;
        this.o.familiar_tag = document.getElementById('controls_panel');
        this.o.familiar_tag.insertAdjacentHTML("beforeend", "<div id='" + this.o.panel_id + "' style='display:flex; flex-direction: column; width:100%;'></div>");
        this.o.panel = document.getElementById(this.o.panel_id);
        ///////////////////////////////////////////////////////////////add display color and switch button
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><button id='onoff" + indexPoint + "'>OFF</button><div id='pointColorDisplay" + indexPoint + "' style='border: 1px solid grey; display: flex; width: 100%;'>point " + indexPoint + " color</div></div>");
        this.o.onOffButton = document.getElementById('onoff' + indexPoint);
        this.o.onOffButton.addEventListener('click', function () {
            if (self.state == 1) {
                self.state = 0;
                self.onOffButton.textContent = '.ON.';
            } else {
                self.state = 1;
                self.onOffButton.textContent = 'OFF';
            }
        });
        ///////////////////////////////////////////////////////////add point red color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='pointRed" + indexPoint + "' style='width : 110px;'>pointRed_" + indexPoint + " </label>\
        <input type='range' name='pointRed"+ indexPoint + "' id='pointRed" + indexPoint + "' min='0.0' max='1.0' step='0.01' value=" + this.o.color[0] + ">\
        <span id='pointRedValue"+ indexPoint + "' style='width : 24px;'></span></div>");
        this.o.inputControlRed = document.getElementById('pointRed' + indexPoint);
        this.o.displayRedValue = document.getElementById('pointRedValue' + indexPoint);
        this.o.displayRedValue.textContent = this.o.color[0];
        this.o.inputControlRed.addEventListener('input', function (event) {
            self.color[0] = event.target.value;
            self.displayRedValue.textContent = event.target.value;
            self.pointColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.pointColorDisplay, self.color, self.intensity);
        });
        ///////////////////////////////////////////////////////////add point green color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='pointGreen" + indexPoint + "' style='width : 110px;'>pointGreen_" + indexPoint + " </label>\
        <input type='range' name='pointGreen"+ indexPoint + "' id='pointGreen" + indexPoint + "' min='0.0' max='1.0' step='0.01' value=" + this.o.color[1] + ">\
        <span id='pointGreenValue"+ indexPoint + "' style='width : 24px;'></span></div>");
        this.o.inputControlGreen = document.getElementById('pointGreen' + indexPoint);
        this.o.displayGreenValue = document.getElementById('pointGreenValue' + indexPoint);
        this.o.displayRedValue.textContent = this.o.color[1];
        this.o.inputControlGreen.addEventListener('input', function (event) {
            self.color[1] = event.target.value;
            self.displayGreenValue.textContent = event.target.value;
            self.pointColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.pointColorDisplay, self.color, self.intensity);
        });
        ///////////////////////////////////////////////////////////add point blue color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='pointBlue" + indexPoint + "' style='width : 110px;'>pointBlue_" + indexPoint + " </label>\
        <input type='range' name='pointBlue"+ indexPoint + "' id='pointBlue" + indexPoint + "' min='0.0' max='1.0' step='0.01' value=" + this.o.color[2] + ">\
        <span id='pointBlueValue"+ indexPoint + "' style='width : 24px;'></span></div>");
        this.o.inputControlBlue = document.getElementById('pointBlue' + indexPoint);
        this.o.displayBlueValue = document.getElementById('pointBlueValue' + indexPoint);
        this.o.displayBlueValue.textContent = this.o.color[2];
        this.o.inputControlBlue.addEventListener('input', function (event) {
            self.color[2] = event.target.value;
            self.displayBlueValue.textContent = event.target.value;
            self.pointColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.pointColorDisplay, self.color, self.intensity);
        });
        ///////////////////////////////////////////////////////////////add point light intensity control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='pointIntensity" + indexPoint + "' style='width : 110px;'>pointIntensity_" + indexPoint + "</label>\
        <input type='range' name='pointIntensity"+ indexPoint + "' id='pointIntensity" + indexPoint + "' min='0.0' max='1.0' step='0.01' value=" + this.o.intensity + ">\
        <span id='pointIntensityValue"+ indexPoint + "' style='width : 24px;'></span></div>");
        this.o.inputControlIntensity = document.getElementById('pointIntensity' + indexPoint);
        this.o.displayIntensityValue = document.getElementById('pointIntensityValue' + indexPoint);
        this.o.displayIntensityValue.textContent = this.o.intensity;
        this.o.inputControlIntensity.addEventListener('input', function (event) {
            self.intensity = event.target.value;
            self.displayIntensityValue.textContent = event.target.value;
            self.pointColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.color, self.intensity);
            adaptBackgroundColor(self.pointColorDisplay, self.color, self.intensity);
        });


        ///////////////////////////////////////////////////////////////
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='point_pos_X" + indexPoint + "' style='width : 110px;'>point_pos_X_" + indexPoint + " </label>\
        <input type='range' name='point_pos_X"+ indexPoint + "' id='point_pos_X" + indexPoint + "' min='-10.0' max='10.0' step='0.01' value=" + this.o.position[0] + ">\
        <span id='point_pos_XValue"+ indexPoint + "' style='width : 24px;'></span></div>");
        this.o.inputControl_pos_X = document.getElementById('point_pos_X' + indexPoint);
        this.o.display_pos_XValue = document.getElementById('point_pos_XValue' + indexPoint);
        this.o.display_pos_XValue.textContent = this.o.position[0];
        this.o.inputControl_pos_X.addEventListener('input', function (event) {
            self.position[0] = event.target.value;
            self.display_pos_XValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////////
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='point_pos_Y" + indexPoint + "' style='width : 110px;'>point_pos_Y_" + indexPoint + " </label>\
        <input type='range' name='point_pos_Y"+ indexPoint + "' id='point_pos_Y" + indexPoint + "' min='-10.0' max='10.0' step='0.01' value=" + this.o.position[1] + ">\
        <span id='point_pos_YValue"+ indexPoint + "' style='width : 24px;'></span></div>");
        this.o.inputControl_pos_Y = document.getElementById('point_pos_Y' + indexPoint);
        this.o.display_pos_YValue = document.getElementById('point_pos_YValue' + indexPoint);
        this.o.display_pos_YValue.textContent = this.o.position[1];
        this.o.inputControl_pos_Y.addEventListener('input', function (event) {
            self.position[1] = event.target.value;
            self.display_pos_YValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////////
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='point_pos_Z" + indexPoint + "' style='width : 110px;'>point_pos_Z_" + indexPoint + " </label>\
        <input type='range' name='point_pos_Z"+ indexPoint + "' id='point_pos_Z" + indexPoint + "' min='-10.0' max='10.0' step='0.01' value=" + this.o.position[2] + ">\
        <span id='point_pos_ZValue"+ indexPoint + "' style='width : 24px;'></span></div>");
        this.o.inputControl_pos_Z = document.getElementById('point_pos_Z' + indexPoint);
        this.o.display_pos_ZValue = document.getElementById('point_pos_ZValue' + indexPoint);
        this.o.display_pos_ZValue.textContent = this.o.position[2];
        this.o.inputControl_pos_Z.addEventListener('input', function (event) {
            self.position[2] = event.target.value;
            self.display_pos_ZValue.textContent = event.target.value;
        });
        /////////////////////////////////////////////////////////////// add scope control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='pointScope" + indexPoint + "' style='width : 110px;'>scope" + indexPoint + "</label>\
        <input type='range' name='pointScope"+ indexPoint + "' id='pointScope" + indexPoint + "' min='0.0' max='24.0' step='0.01' value=" + this.o.scope + ">\
        <span id='pointScopeValue"+ indexPoint + "' style='width : 24px;'></span></div>");
        this.o.inputControlScope = document.getElementById('pointScope' + indexPoint);
        this.o.displayScopeValue = document.getElementById('pointScopeValue' + indexPoint);
        this.o.displayScopeValue.textContent = this.o.scope;
        this.o.inputControlScope.addEventListener('input', function (event) {
            self.scope = event.target.value;
            self.displayScopeValue.textContent = event.target.value;
        });


        ///////////////////////////////////////////////////////////////
        this.o.pointColorDisplay = document.getElementById('pointColorDisplay' + indexPoint);
        this.o.pointColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(this.o.color, this.o.intensity);
    }
}

class LightingControls {
    constructor(o) {
        this.o = o;
    }
    create() {
        const self = this.o;
        this.o.panel_id = "generalLighting";
        this.o.familiar_tag = document.getElementById('controls_panel');
        this.o.familiar_tag.insertAdjacentHTML("beforeend", "<div id='" + this.o.panel_id + "' style='display:flex; flex-direction: column; width:100%;'></div>");
        this.o.panel = document.getElementById(this.o.panel_id);
        ///////////////////////////////////////////////////////////add point red color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><div id='lighting' style='border: 1px solid grey; background-color: white; color: black; display: flex; width: 100%;'>General Lighting</div></div>");
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='generalIntensity' style='width : 110px;'>general intensity</label>\
        <input type='range' name='generalIntensity' id='generalIntensity' min='0.0' max='1.0' step='0.01' value="+ this.o.intensity + ">\
        <span id='generalIntensityValue' style='width : 24px;'></span></div>");
        this.o.inputgeneralIntensity = document.getElementById('generalIntensity');
        this.o.displaygeneralIntensityValue = document.getElementById('generalIntensityValue');
        this.o.displaygeneralIntensityValue.textContent = this.o.intensity;
        this.o.inputgeneralIntensity.addEventListener('input', function (event) {
            self.intensity = event.target.value;
            self.displaygeneralIntensityValue.textContent = event.target.value;
        });
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='generalIntensity' style='width : 110px;'>bias</label>\
        <input type='range' name='bias' id='bias' min='0.0' max='1.0' step='0.0001' value="+ this.o.bias + ">\
        <span id='biasValue' style='width : 24px;'></span></div>");
        this.o.inputBias = document.getElementById('bias');
        this.o.displayBiasValue = document.getElementById('biasValue');
        this.o.displayBiasValue.textContent = this.o.bias;
        this.o.inputBias.addEventListener('input', function (event) {
            self.bias = event.target.value;
            self.displayBiasValue.textContent = event.target.value;
        });
    }
}

class DiffuseObjectControls {
    constructor(o) {
        this.o = o;
    }
    create(name) {
        this.name = name;
        const self = this.o;
        this.o.panel_id = name;
        this.o.familiar_tag = document.getElementById('controls_panel');
        this.o.familiar_tag.insertAdjacentHTML("beforeend", "<div id='" + this.o.panel_id + "' style='display:flex; flex-direction: column; width:100%;'></div>");
        this.o.panel = document.getElementById(this.o.panel_id);
        this.o.minScale = 0.001;
        this.o.maxScale = 4.0;
        this.o.scale = 1.0;
        ///////////////////////////////////////////////////////////////add display color and switch button
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display:flex;'><button id='onoff" + name + "'>OFF</button><div id='" + this.name + "ColorDisplay' style='border: 1px solid grey; display: flex; width: 100%;'>" + name + " color</div></div>");
        this.o.diffuseObjectColorDisplay = document.getElementById(name + 'ColorDisplay');
        this.o.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
        adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        this.o.onOffButton = document.getElementById('onoff' + name);
        this.o.onOffButton.addEventListener('click', function () {
            if (self.state == 1) {
                self.state = 0;
                self.onOffButton.textContent = '.ON.';
            } else {
                self.state = 1;
                self.onOffButton.textContent = 'OFF';
            }
        });
        ///////////////////////////////////////////////////////////add diffuse red color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseRed' style='width : 110px;'>" + name + "diffuseRed </label>\
        <input type='range' name='"+ name + "diffuseRed' id='" + name + "diffuseRed' min='0.0' max='1.0' step='0.01' value=" + this.o.diffuseColor[0] + ">\
        <span id='"+ name + "diffuseRedValue' style='width : 24px;'></span></div>");
        this.o.inputControlRed = document.getElementById(name + 'diffuseRed');
        this.o.displayRedValue = document.getElementById(name + 'diffuseRedValue');
        this.o.displayRedValue.textContent = this.o.diffuseColor[0];
        this.o.inputControlRed.addEventListener('input', function (event) {
            self.diffuseColor[0] = event.target.value;
            self.displayRedValue.textContent = event.target.value;
            self.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
            adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add diffuse green color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseGreen' style='width : 110px;'>" + name + "diffuseGreen </label>\
        <input type='range' name='"+ name + "diffuseGreen' id='" + name + "diffuseGreen' min='0.0' max='1.0' step='0.01' value=" + this.o.diffuseColor[1] + ">\
        <span id='"+ name + "diffuseGreenValue' style='width : 24px;'></span></div>");
        this.o.inputControlGreen = document.getElementById(name + 'diffuseGreen');
        this.o.displayGreenValue = document.getElementById(name + 'diffuseGreenValue');
        this.o.displayGreenValue.textContent = this.o.diffuseColor[1];
        this.o.inputControlGreen.addEventListener('input', function (event) {
            self.diffuseColor[1] = event.target.value;
            self.displayGreenValue.textContent = event.target.value;
            self.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
            adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add diffuse blue color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseBlue' style='width : 110px;'>" + name + "diffuseBlue </label>\
        <input type='range' name='"+ name + "diffuseBlue' id='" + name + "diffuseBlue' min='0.0' max='1.0' step='0.01' value=" + this.o.diffuseColor[2] + ">\
        <span id='"+ name + "diffuseBlueValue' style='width : 24px;'></span></div>");
        this.o.inputControlBlue = document.getElementById(name + 'diffuseBlue');
        this.o.displayBlueValue = document.getElementById(name + 'diffuseBlueValue');
        this.o.displayBlueValue.textContent = this.o.diffuseColor[2];
        this.o.inputControlBlue.addEventListener('input', function (event) {
            self.diffuseColor[2] = event.target.value;
            self.displayBlueValue.textContent = event.target.value;
            self.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
            adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add diffuse alpha color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseAlpha' style='width : 110px;'>" + name + "diffuseAlpha </label>\
        <input type='range' name='"+ name + "diffuseAlpha' id='" + name + "diffuseAlpha' min='0.0' max='1.0' step='0.01' value=" + this.o.alpha + ">\
        <span id='"+ name + "diffuseAlphaValue' style='width : 24px;'></span></div>");
        this.o.inputControlAlpha = document.getElementById(name + 'diffuseAlpha');
        this.o.displayAlphaValue = document.getElementById(name + 'diffuseAlphaValue');
        this.o.displayAlphaValue.textContent = this.o.alpha;
        this.o.inputControlAlpha.addEventListener('input', function (event) {
            self.alpha = event.target.value;
            self.displayAlphaValue.textContent = event.target.value;
            self.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, self.alpha);
            adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add position X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='position_X" + this.name + "' style='width : 110px;'>" + this.name + " pos X</label>\
        <input type='range' name='position_X"+ this.name + "' id='position_X" + this.name + "' min='-10.0' max='10.0' step='0.01' value=" + this.o.positionMatrix[12] + ">\
        <span id='position_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlPositionX = document.getElementById('position_X' + name);
        this.o.displayPositionXValue = document.getElementById('position_X' + name + 'Value');
        this.o.displayPositionXValue.textContent = this.o.positionMatrix[12];
        this.o.inputControlPositionX.addEventListener('input', function (event) {
            self.positionMatrix[12] = event.target.value;
            self.displayPositionXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add position Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='position_Y" + this.name + "' style='width : 110px;'>" + this.name + " pos Y</label>\
        <input type='range' name='position_Y"+ this.name + "' id='position_Y" + this.name + "' min='-10.0' max='10.0' step='0.01' value=" + this.o.positionMatrix[13] + ">\
        <span id='position_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlPositionY = document.getElementById('position_Y' + name);
        this.o.displayPositionYValue = document.getElementById('position_Y' + name + 'Value');
        this.o.displayPositionYValue.textContent = this.o.positionMatrix[13];
        this.o.inputControlPositionY.addEventListener('input', function (event) {
            self.positionMatrix[13] = event.target.value;
            self.displayPositionYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add position Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='position_Z" + this.name + "' style='width : 110px;'>" + this.name + " pos Z</label>\
        <input type='range' name='position_Z"+ this.name + "' id='position_Z" + this.name + "' min='-10.0' max='10.0' step='0.01' value=" + this.o.positionMatrix[14] + ">\
        <span id='position_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlPositionZ = document.getElementById('position_Z' + name);
        this.o.displayPositionZValue = document.getElementById('position_Z' + name + 'Value');
        this.o.displayPositionZValue.textContent = this.o.positionMatrix[14];
        this.o.inputControlPositionZ.addEventListener('input', function (event) {
            self.positionMatrix[14] = event.target.value;
            self.displayPositionZValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add scalar X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='scalar_X" + this.name + "' style='width : 110px;'>" + this.name + " sca X</label>\
        <input type='range' name='scalar_X"+ this.name + "' id='scalar_X" + this.name + "' min='" + this.o.minScale + "' max='" + this.o.maxScale + "' step='0.001' value=" + this.o.scalarMatrix[0] + ">\
        <span id='scalar_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlScalarX = document.getElementById('scalar_X' + name);
        this.o.displayScalarXValue = document.getElementById('scalar_X' + name + 'Value');
        this.o.displayScalarXValue.textContent = this.o.scalarMatrix[0];
        this.o.inputControlScalarX.addEventListener('input', function (event) {
            self.scalarMatrix[0] = event.target.value;
            self.displayScalarXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add scalar Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='scalar_Y" + this.name + "' style='width : 110px;'>" + this.name + " sca Y</label>\
        <input type='range' name='scalar_Y"+ this.name + "' id='scalar_Y" + this.name + "' min='" + this.o.minScale + "' max='" + this.o.maxScale + "' step='0.001' value=" + this.o.scalarMatrix[5] + ">\
        <span id='scalar_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlScalarY = document.getElementById('scalar_Y' + name);
        this.o.displayScalarYValue = document.getElementById('scalar_Y' + name + 'Value');
        this.o.displayScalarYValue.textContent = this.o.scalarMatrix[5];
        this.o.inputControlScalarY.addEventListener('input', function (event) {
            self.scalarMatrix[5] = event.target.value;
            self.displayScalarYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add scalar Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='scalar_Z" + this.name + "' style='width : 110px;'>" + this.name + " sca Z</label>\
        <input type='range' name='scalar_Z"+ this.name + "' id='scalar_Z" + this.name + "' min='" + this.o.minScale + "' max='" + this.o.maxScale + "' step='0.001' value=" + this.o.scalarMatrix[10] + ">\
        <span id='scalar_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlScalarZ = document.getElementById('scalar_Z' + name);
        this.o.displayScalarZValue = document.getElementById('scalar_Z' + name + 'Value');
        this.o.displayScalarZValue.textContent = this.o.scalarMatrix[10];
        this.o.inputControlScalarZ.addEventListener('input', function (event) {
            self.scalarMatrix[10] = event.target.value;
            self.displayScalarZValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add total scalar control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display:flex;'>\
        <button id='enlarge"+ name + "'>enlarge</button>\
        <button id='shrink"+ name + "'>shrink</button>\
        <button id='resetScale"+ name + "'>reset scale</button></div>");
        this.enlargeButton = document.getElementById('enlarge' + name);
        this.shrinkButton = document.getElementById('shrink' + name);
        this.resetScaleButton = document.getElementById('resetScale' + name);
        this.enlargeButton.addEventListener('click', function () {
            if ((self.maxScale > self.scalarMatrix[0] * 1.05 && self.maxScale > self.scalarMatrix[5] * 1.05) && self.maxScale > self.scalarMatrix[10] * 1.05) {
                self.scalarMatrix[0] *= 1.05;
                self.scalarMatrix[5] *= 1.05;
                self.scalarMatrix[10] *= 1.05;
                self.inputControlScalarX.value = self.scalarMatrix[0];
                self.inputControlScalarY.value = self.scalarMatrix[5];
                self.inputControlScalarZ.value = self.scalarMatrix[10];
                self.displayScalarXValue.textContent = self.scalarMatrix[0];
                self.displayScalarYValue.textContent = self.scalarMatrix[5];
                self.displayScalarZValue.textContent = self.scalarMatrix[10];
            }
        });
        this.shrinkButton.addEventListener('click', function () {
            if ((self.minScale < self.scalarMatrix[0] / 1.05 && self.minScale < self.scalarMatrix[5] / 1.05) && self.minScale < self.scalarMatrix[10] / 1.05) {
                self.scalarMatrix[0] /= 1.05;
                self.scalarMatrix[5] /= 1.05;
                self.scalarMatrix[10] /= 1.05;
                self.inputControlScalarX.value = self.scalarMatrix[0];
                self.inputControlScalarY.value = self.scalarMatrix[5];
                self.inputControlScalarZ.value = self.scalarMatrix[10];
                self.displayScalarXValue.textContent = self.scalarMatrix[0];
                self.displayScalarYValue.textContent = self.scalarMatrix[5];
                self.displayScalarZValue.textContent = self.scalarMatrix[10];
            }
        });
        this.resetScaleButton.addEventListener('click', function () {

            self.scalarMatrix[0] = 1.0;
            self.scalarMatrix[5] = 1.0;
            self.scalarMatrix[10] = 1.0;
            self.inputControlScalarX.value = self.scalarMatrix[0];
            self.inputControlScalarY.value = self.scalarMatrix[5];
            self.inputControlScalarZ.value = self.scalarMatrix[10];
            self.displayScalarXValue.textContent = self.scalarMatrix[0];
            self.displayScalarYValue.textContent = self.scalarMatrix[5];
            self.displayScalarZValue.textContent = self.scalarMatrix[10];
        });
        ///////////////////////////////////////////////////////////add angle X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ang_X" + this.name + "' style='width : 110px;'>" + this.name + " world ang X</label>\
               <input type='range' name='ang_X"+ this.name + "' id='ang_X" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.angleX + ">\
               <span id='ang_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngX = document.getElementById('ang_X' + this.name);
        this.o.displayAngXValue = document.getElementById('ang_X' + this.name + 'Value');
        this.o.displayAngXValue.textContent = this.o.angleX;
        this.o.inputControlAngX.addEventListener('input', function (event) {
            orientViewX(self, event.target.value);
            self.displayAngXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add angle Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ang_Y" + this.name + "' style='width : 110px;'>" + this.name + " world ang Y</label>\
               <input type='range' name='ang_Y"+ this.name + "' id='ang_Y" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.angleY + ">\
               <span id='ang_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngY = document.getElementById('ang_Y' + this.name);
        this.o.displayAngYValue = document.getElementById('ang_Y' + this.name + 'Value');
        this.o.displayAngYValue.textContent = this.o.angleY;
        this.o.inputControlAngY.addEventListener('input', function (event) {
            orientViewY(self, event.target.value);
            self.displayAngYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add angle Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ang_Z" + this.name + "' style='width : 110px;'>" + this.name + " world ang Z</label>\
               <input type='range' name='ang_Z"+ this.name + "' id='ang_Z" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.angleZ + ">\
               <span id='ang_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngZ = document.getElementById('ang_Z' + this.name);
        this.o.displayAngZValue = document.getElementById('ang_Z' + this.name + 'Value');
        this.o.displayAngZValue.textContent = this.o.angleZ;
        this.o.inputControlAngZ.addEventListener('input', function (event) {
            orientViewZ(self, event.target.value);
            self.displayAngZValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add own angle X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ownang_X" + this.name + "' style='width : 110px;'>" + this.name + " own ang X</label>\
               <input type='range' name='ownang_X"+ this.name + "' id='ownang_X" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.ownAngleX + ">\
               <span id='ownang_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlOwnAngX = document.getElementById('ownang_X' + this.name);
        this.o.displayOwnAngXValue = document.getElementById('ownang_X' + this.name + 'Value');
        this.o.displayOwnAngXValue.textContent = this.o.ownAngleX;
        this.o.inputControlOwnAngX.addEventListener('input', function (event) {
            rotateOwnAxisX(self, event.target.value);
            self.displayOwnAngXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add own angle Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ownang_Y" + this.name + "' style='width : 110px;'>" + this.name + " own ang Y</label>\
               <input type='range' name='ownang_Y"+ this.name + "' id='ownang_Y" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.ownAngleY + ">\
               <span id='ownang_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlOwnAngY = document.getElementById('ownang_Y' + this.name);
        this.o.displayOwnAngYValue = document.getElementById('ownang_Y' + this.name + 'Value');
        this.o.displayOwnAngYValue.textContent = this.o.ownAngleY;
        this.o.inputControlOwnAngY.addEventListener('input', function (event) {
            rotateOwnAxisY(self, event.target.value);
            self.displayOwnAngYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add own angle Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ownang_Z" + this.name + "' style='width : 110px;'>" + this.name + " own ang Z</label>\
               <input type='range' name='ownang_Z"+ this.name + "' id='ownang_Z" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.ownAngleZ + ">\
               <span id='ownang_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlOwnAngZ = document.getElementById('ownang_Z' + this.name);
        this.o.displayOwnAngZValue = document.getElementById('ownang_Z' + this.name + 'Value');
        this.o.displayOwnAngZValue.textContent = this.o.ownAngleZ;
        this.o.inputControlOwnAngZ.addEventListener('input', function (event) {
            rotateOwnAxisZ(self, event.target.value);
            self.displayOwnAngZValue.textContent = event.target.value;
        });
    }
    refresh() {
        this.o.inputControlRed.value = this.o.diffuseColor[0];
        this.o.inputControlGreen.value = this.o.diffuseColor[1];
        this.o.inputControlBlue.value = this.o.diffuseColor[2];
        this.o.inputControlPositionX.value = this.o.positionMatrix[12];
        this.o.inputControlPositionY.value = this.o.positionMatrix[13];
        this.o.inputControlPositionZ.value = this.o.positionMatrix[14];
        this.o.inputControlScalarX.value = this.o.scalarMatrix[0];
        this.o.inputControlScalarY.value = this.o.scalarMatrix[5];
        this.o.inputControlScalarZ.value = this.o.scalarMatrix[10];
        this.o.inputControlAngX.value = this.o.angleX;
        this.o.inputControlAngY.value = this.o.angleY;
        this.o.inputControlAngZ.value = this.o.angleZ;
        this.o.inputControlOwnAngX.value = this.o.ownAngleX;
        this.o.inputControlOwnAngY.value = this.o.ownAngleY;
        this.o.inputControlOwnAngZ.value = this.o.ownAngleZ;
    }
}

class SunControls {
    constructor(o) {
        this.o = o;
    }
    create(name) {
        this.name = name;
        const self = this.o;
        this.o.panel_id = name;
        this.o.familiar_tag = document.getElementById('controls_panel');
        this.o.familiar_tag.insertAdjacentHTML("beforeend", "<div id='" + this.o.panel_id + "' style='display:flex; flex-direction: column; width:100%;'></div>");
        this.o.panel = document.getElementById(this.o.panel_id);
        this.o.minScale = 0.001;
        this.o.maxScale = 4.0;
        this.o.scale = 1.0;
        ///////////////////////////////////////////////////////////////add display color and switch button
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display:flex;'><button id='onoff" + name + "'>OFF</button><div id='" + this.name + "ColorDisplay' style='border: 1px solid grey; display: flex; width: 100%;'>" + name + " color</div></div>");
        this.o.sunColorDisplay = document.getElementById(name + 'ColorDisplay');
        this.o.sunColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
        adaptBackgroundColor(self.sunColorDisplay, self.diffuseColor, 1);
        this.o.onOffButton = document.getElementById('onoff' + name);
        this.o.onOffButton.addEventListener('click', function () {
            if (self.state == 1) {
                self.state = 0;
                self.onOffButton.textContent = '.ON.';
            } else {
                self.state = 1;
                self.onOffButton.textContent = 'OFF';
            }
        });
        ///////////////////////////////////////////////////////////add diffuse red color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseRed' style='width : 110px;'>" + name + "diffuseRed </label>\
        <input type='range' name='"+ name + "diffuseRed' id='" + name + "diffuseRed' min='0.0' max='1.0' step='0.01' value=" + this.o.diffuseColor[0] + ">\
        <span id='"+ name + "diffuseRedValue' style='width : 24px;'></span></div>");
        this.o.inputControlRed = document.getElementById(name + 'diffuseRed');
        this.o.displayRedValue = document.getElementById(name + 'diffuseRedValue');
        this.o.displayRedValue.textContent = this.o.diffuseColor[0];
        this.o.inputControlRed.addEventListener('input', function (event) {
            self.diffuseColor[0] = event.target.value;
            self.displayRedValue.textContent = event.target.value;
            self.sunColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
            adaptBackgroundColor(self.sunColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add diffuse green color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseGreen' style='width : 110px;'>" + name + "diffuseGreen </label>\
        <input type='range' name='"+ name + "diffuseGreen' id='" + name + "diffuseGreen' min='0.0' max='1.0' step='0.01' value=" + this.o.diffuseColor[1] + ">\
        <span id='"+ name + "diffuseGreenValue' style='width : 24px;'></span></div>");
        this.o.inputControlGreen = document.getElementById(name + 'diffuseGreen');
        this.o.displayGreenValue = document.getElementById(name + 'diffuseGreenValue');
        this.o.displayGreenValue.textContent = this.o.diffuseColor[1];
        this.o.inputControlGreen.addEventListener('input', function (event) {
            self.diffuseColor[1] = event.target.value;
            self.displayGreenValue.textContent = event.target.value;
            self.sunColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
            adaptBackgroundColor(self.sunColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add diffuse blue color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseBlue' style='width : 110px;'>" + name + "diffuseBlue </label>\
        <input type='range' name='"+ name + "diffuseBlue' id='" + name + "diffuseBlue' min='0.0' max='1.0' step='0.01' value=" + this.o.diffuseColor[2] + ">\
        <span id='"+ name + "diffuseBlueValue' style='width : 24px;'></span></div>");
        this.o.inputControlBlue = document.getElementById(name + 'diffuseBlue');
        this.o.displayBlueValue = document.getElementById(name + 'diffuseBlueValue');
        this.o.displayBlueValue.textContent = this.o.diffuseColor[2];
        this.o.inputControlBlue.addEventListener('input', function (event) {
            self.diffuseColor[2] = event.target.value;
            self.displayBlueValue.textContent = event.target.value;
            self.sunColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
            adaptBackgroundColor(self.sunColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add diffuse alpha color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseAlpha' style='width : 110px;'>" + name + "diffuseAlpha </label>\
        <input type='range' name='"+ name + "diffuseAlpha' id='" + name + "diffuseAlpha' min='0.0' max='1.0' step='0.01' value=" + this.o.alpha + ">\
        <span id='"+ name + "diffuseAlphaValue' style='width : 24px;'></span></div>");
        this.o.inputControlAlpha = document.getElementById(name + 'diffuseAlpha');
        this.o.displayAlphaValue = document.getElementById(name + 'diffuseAlphaValue');
        this.o.displayAlphaValue.textContent = this.o.alpha;
        this.o.inputControlAlpha.addEventListener('input', function (event) {
            self.alpha = event.target.value;
            self.displayAlphaValue.textContent = event.target.value;
            self.sunColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, self.alpha);
            adaptBackgroundColor(self.sunColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add position X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='position_X" + this.name + "' style='width : 110px;'>" + this.name + " pos X</label>\
        <span id='position_X"+ name + "Value' style='width : 24px;'></span></div>");
        //this.o.inputControlPositionX = document.getElementById('position_X' + name);
        this.o.displayPositionXValue = document.getElementById('position_X' + name + 'Value');
        this.o.displayPositionXValue.textContent = this.o.positionMatrix[12];
        /*this.o.inputControlPositionX.addEventListener('input', function (event) {
            self.positionMatrix[12] = event.target.value;
            self.displayPositionXValue.textContent = event.target.value;
        })*/;
        ///////////////////////////////////////////////////////////add position Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='position_Y" + this.name + "' style='width : 110px;'>" + this.name + " pos Y</label>\
        <span id='position_Y"+ name + "Value' style='width : 24px;'></span></div>");
        //this.o.inputControlPositionY = document.getElementById('position_Y' + name);
        this.o.displayPositionYValue = document.getElementById('position_Y' + name + 'Value');
        this.o.displayPositionYValue.textContent = this.o.positionMatrix[13];
        /*this.o.inputControlPositionY.addEventListener('input', function (event) {
            self.positionMatrix[13] = event.target.value;
            self.displayPositionYValue.textContent = event.target.value;
        });*/
        ///////////////////////////////////////////////////////////add position Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='position_Z" + this.name + "' style='width : 110px;'>" + this.name + " pos Z</label>\
        <span id='position_Z"+ name + "Value' style='width : 24px;'></span></div>");
        //this.o.inputControlPositionZ = document.getElementById('position_Z' + name);
        this.o.displayPositionZValue = document.getElementById('position_Z' + name + 'Value');
        this.o.displayPositionZValue.textContent = this.o.positionMatrix[14];
        /*this.o.inputControlPositionZ.addEventListener('input', function (event) {
            self.positionMatrix[14] = event.target.value;
            self.displayPositionZValue.textContent = event.target.value;
        });*/
        ///////////////////////////////////////////////////////////add angle from Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='angleFromY" + this.name + "' style='width : 110px;'>" + this.name + " angleFromY</label>\
        <input type='range' name='angleFromY"+ this.name + "' id='angleFromY" + this.name + "' min='-6.29' max='6.29' step='0.01' value=" + this.o.angleFromY + ">\
        <span id='angleFromY"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngleFromY = document.getElementById('angleFromY' + name);
        this.o.displayAngleFromYValue = document.getElementById('angleFromY' + name + 'Value');
        this.o.displayAngleFromYValue.textContent = this.o.angleFromY;
        this.o.inputControlAngleFromY.addEventListener('input', function (event) {
            self.positionAngleWithYAxis(event.target.value);
            self.displayAngleFromYValue.textContent = event.target.value;
            self.displayPositionXValue.textContent = self.positionMatrix[12];
            self.displayPositionYValue.textContent = self.positionMatrix[13];
            self.displayPositionZValue.textContent = self.positionMatrix[14];
        });
        ///////////////////////////////////////////////////////////add angle from Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='angleFromZ" + this.name + "' style='width : 110px;'>" + this.name + " angleFromZ</label>\
        <input type='range' name='angleFromZ"+ this.name + "' id='angleFromZ" + this.name + "' min='-6.29' max='6.29' step='0.01' value=" + this.o.angleFromZ + ">\
        <span id='angleFromZ"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngleFromZ = document.getElementById('angleFromZ' + name);
        this.o.displayAngleFromZValue = document.getElementById('angleFromZ' + name + 'Value');
        this.o.displayAngleFromZValue.textContent = this.o.angleFromZ;
        this.o.inputControlAngleFromZ.addEventListener('input', function (event) {
            self.positionAngleWithZAxis(event.target.value);
            self.displayAngleFromZValue.textContent = event.target.value;
            self.displayPositionXValue.textContent = self.positionMatrix[12];
            self.displayPositionYValue.textContent = self.positionMatrix[13];
            self.displayPositionZValue.textContent = self.positionMatrix[14];
        });
        ///////////////////////////////////////////////////////////add scalar X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='scalar_X" + this.name + "' style='width : 110px;'>" + this.name + " sca X</label>\
        <input type='range' name='scalar_X"+ this.name + "' id='scalar_X" + this.name + "' min='" + this.o.minScale + "' max='" + this.o.maxScale + "' step='0.001' value=" + this.o.scalarMatrix[0] + ">\
        <span id='scalar_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlScalarX = document.getElementById('scalar_X' + name);
        this.o.displayScalarXValue = document.getElementById('scalar_X' + name + 'Value');
        this.o.displayScalarXValue.textContent = this.o.scalarMatrix[0];
        this.o.inputControlScalarX.addEventListener('input', function (event) {
            self.scalarMatrix[0] = event.target.value;
            self.displayScalarXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add scalar Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='scalar_Y" + this.name + "' style='width : 110px;'>" + this.name + " sca Y</label>\
        <input type='range' name='scalar_Y"+ this.name + "' id='scalar_Y" + this.name + "' min='" + this.o.minScale + "' max='" + this.o.maxScale + "' step='0.001' value=" + this.o.scalarMatrix[5] + ">\
        <span id='scalar_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlScalarY = document.getElementById('scalar_Y' + name);
        this.o.displayScalarYValue = document.getElementById('scalar_Y' + name + 'Value');
        this.o.displayScalarYValue.textContent = this.o.scalarMatrix[5];
        this.o.inputControlScalarY.addEventListener('input', function (event) {
            self.scalarMatrix[5] = event.target.value;
            self.displayScalarYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add scalar Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='scalar_Z" + this.name + "' style='width : 110px;'>" + this.name + " sca Z</label>\
        <input type='range' name='scalar_Z"+ this.name + "' id='scalar_Z" + this.name + "' min='" + this.o.minScale + "' max='" + this.o.maxScale + "' step='0.001' value=" + this.o.scalarMatrix[10] + ">\
        <span id='scalar_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlScalarZ = document.getElementById('scalar_Z' + name);
        this.o.displayScalarZValue = document.getElementById('scalar_Z' + name + 'Value');
        this.o.displayScalarZValue.textContent = this.o.scalarMatrix[10];
        this.o.inputControlScalarZ.addEventListener('input', function (event) {
            self.scalarMatrix[10] = event.target.value;
            self.displayScalarZValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add total scalar control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display:flex;'>\
        <button id='enlarge"+ name + "'>enlarge</button>\
        <button id='shrink"+ name + "'>shrink</button>\
        <button id='resetScale"+ name + "'>reset scale</button></div>");
        this.enlargeButton = document.getElementById('enlarge' + name);
        this.shrinkButton = document.getElementById('shrink' + name);
        this.resetScaleButton = document.getElementById('resetScale' + name);
        this.enlargeButton.addEventListener('click', function () {
            if ((self.maxScale > self.scalarMatrix[0] * 1.05 && self.maxScale > self.scalarMatrix[5] * 1.05) && self.maxScale > self.scalarMatrix[10] * 1.05) {
                self.scalarMatrix[0] *= 1.05;
                self.scalarMatrix[5] *= 1.05;
                self.scalarMatrix[10] *= 1.05;
                self.inputControlScalarX.value = self.scalarMatrix[0];
                self.inputControlScalarY.value = self.scalarMatrix[5];
                self.inputControlScalarZ.value = self.scalarMatrix[10];
                self.displayScalarXValue.textContent = self.scalarMatrix[0];
                self.displayScalarYValue.textContent = self.scalarMatrix[5];
                self.displayScalarZValue.textContent = self.scalarMatrix[10];
            }
        });
        this.shrinkButton.addEventListener('click', function () {
            if ((self.minScale < self.scalarMatrix[0] / 1.05 && self.minScale < self.scalarMatrix[5] / 1.05) && self.minScale < self.scalarMatrix[10] / 1.05) {
                self.scalarMatrix[0] /= 1.05;
                self.scalarMatrix[5] /= 1.05;
                self.scalarMatrix[10] /= 1.05;
                self.inputControlScalarX.value = self.scalarMatrix[0];
                self.inputControlScalarY.value = self.scalarMatrix[5];
                self.inputControlScalarZ.value = self.scalarMatrix[10];
                self.displayScalarXValue.textContent = self.scalarMatrix[0];
                self.displayScalarYValue.textContent = self.scalarMatrix[5];
                self.displayScalarZValue.textContent = self.scalarMatrix[10];
            }
        });
        this.resetScaleButton.addEventListener('click', function () {

            self.scalarMatrix[0] = 1.0;
            self.scalarMatrix[5] = 1.0;
            self.scalarMatrix[10] = 1.0;
            self.inputControlScalarX.value = self.scalarMatrix[0];
            self.inputControlScalarY.value = self.scalarMatrix[5];
            self.inputControlScalarZ.value = self.scalarMatrix[10];
            self.displayScalarXValue.textContent = self.scalarMatrix[0];
            self.displayScalarYValue.textContent = self.scalarMatrix[5];
            self.displayScalarZValue.textContent = self.scalarMatrix[10];
        });
        ///////////////////////////////////////////////////////////add angle X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ang_X" + this.name + "' style='width : 110px;'>" + this.name + " world ang X</label>\
               <input type='range' name='ang_X"+ this.name + "' id='ang_X" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.angleX + ">\
               <span id='ang_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngX = document.getElementById('ang_X' + this.name);
        this.o.displayAngXValue = document.getElementById('ang_X' + this.name + 'Value');
        this.o.displayAngXValue.textContent = this.o.angleX;
        this.o.inputControlAngX.addEventListener('input', function (event) {
            orientViewX(self, event.target.value);
            self.displayAngXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add angle Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ang_Y" + this.name + "' style='width : 110px;'>" + this.name + " world ang Y</label>\
               <input type='range' name='ang_Y"+ this.name + "' id='ang_Y" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.angleY + ">\
               <span id='ang_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngY = document.getElementById('ang_Y' + this.name);
        this.o.displayAngYValue = document.getElementById('ang_Y' + this.name + 'Value');
        this.o.displayAngYValue.textContent = this.o.angleY;
        this.o.inputControlAngY.addEventListener('input', function (event) {
            orientViewY(self, event.target.value);
            self.displayAngYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add angle Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ang_Z" + this.name + "' style='width : 110px;'>" + this.name + " world ang Z</label>\
               <input type='range' name='ang_Z"+ this.name + "' id='ang_Z" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.angleZ + ">\
               <span id='ang_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngZ = document.getElementById('ang_Z' + this.name);
        this.o.displayAngZValue = document.getElementById('ang_Z' + this.name + 'Value');
        this.o.displayAngZValue.textContent = this.o.angleZ;
        this.o.inputControlAngZ.addEventListener('input', function (event) {
            orientViewZ(self, event.target.value);
            self.displayAngZValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add own angle X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ownang_X" + this.name + "' style='width : 110px;'>" + this.name + " own ang X</label>\
               <input type='range' name='ownang_X"+ this.name + "' id='ownang_X" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.ownAngleX + ">\
               <span id='ownang_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlOwnAngX = document.getElementById('ownang_X' + this.name);
        this.o.displayOwnAngXValue = document.getElementById('ownang_X' + this.name + 'Value');
        this.o.displayOwnAngXValue.textContent = this.o.ownAngleX;
        this.o.inputControlOwnAngX.addEventListener('input', function (event) {
            rotateOwnAxisX(self, event.target.value);
            self.displayOwnAngXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add own angle Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ownang_Y" + this.name + "' style='width : 110px;'>" + this.name + " own ang Y</label>\
               <input type='range' name='ownang_Y"+ this.name + "' id='ownang_Y" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.ownAngleY + ">\
               <span id='ownang_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlOwnAngY = document.getElementById('ownang_Y' + this.name);
        this.o.displayOwnAngYValue = document.getElementById('ownang_Y' + this.name + 'Value');
        this.o.displayOwnAngYValue.textContent = this.o.ownAngleY;
        this.o.inputControlOwnAngY.addEventListener('input', function (event) {
            rotateOwnAxisY(self, event.target.value);
            self.displayOwnAngYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add own angle Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ownang_Z" + this.name + "' style='width : 110px;'>" + this.name + " own ang Z</label>\
               <input type='range' name='ownang_Z"+ this.name + "' id='ownang_Z" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.ownAngleZ + ">\
               <span id='ownang_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlOwnAngZ = document.getElementById('ownang_Z' + this.name);
        this.o.displayOwnAngZValue = document.getElementById('ownang_Z' + this.name + 'Value');
        this.o.displayOwnAngZValue.textContent = this.o.ownAngleZ;
        this.o.inputControlOwnAngZ.addEventListener('input', function (event) {
            rotateOwnAxisZ(self, event.target.value);
            self.displayOwnAngZValue.textContent = event.target.value;
        });
    }
    refresh() {
        this.o.inputControlRed.value = this.o.diffuseColor[0];
        this.o.inputControlGreen.value = this.o.diffuseColor[1];
        this.o.inputControlBlue.value = this.o.diffuseColor[2];
        this.o.inputControlPositionX.value = this.o.positionMatrix[12];
        this.o.inputControlPositionY.value = this.o.positionMatrix[13];
        this.o.inputControlPositionZ.value = this.o.positionMatrix[14];
        this.o.inputControlScalarX.value = this.o.scalarMatrix[0];
        this.o.inputControlScalarY.value = this.o.scalarMatrix[5];
        this.o.inputControlScalarZ.value = this.o.scalarMatrix[10];
        this.o.inputControlAngX.value = this.o.angleX;
        this.o.inputControlAngY.value = this.o.angleY;
        this.o.inputControlAngZ.value = this.o.angleZ;
        this.o.inputControlOwnAngX.value = this.o.ownAngleX;
        this.o.inputControlOwnAngY.value = this.o.ownAngleY;
        this.o.inputControlOwnAngZ.value = this.o.ownAngleZ;
    }
}

class TerrainControls {
    constructor(o) {
        this.o = o;
    }
    create(name) {
        this.name = name;
        const self = this.o;
        this.o.panel_id = name;
        this.o.familiar_tag = document.getElementById('controls_panel');
        this.o.familiar_tag.insertAdjacentHTML("beforeend", "<div id='" + this.o.panel_id + "' style='display:flex; flex-direction: column; width:100%;'></div>");
        this.o.panel = document.getElementById(this.o.panel_id);
        this.o.minScale = 0;
        this.o.maxScale = 4.0;
        this.o.scale = 1.0;
        ///////////////////////////////////////////////////////////////add display color and switch button
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display:flex;'><button id='onoff" + name + "'>OFF</button><div id='" + this.name + "ColorDisplay' style='border: 1px solid grey; display: flex; width: 100%;'>" + name + " color</div></div>");
        this.o.diffuseObjectColorDisplay = document.getElementById(name + 'ColorDisplay');
        this.o.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
        adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        this.o.onOffButton = document.getElementById('onoff' + name);
        this.o.onOffButton.addEventListener('click', function () {
            if (self.state == 1) {
                self.state = 0;
                self.onOffButton.textContent = '.ON.';
            } else {
                self.state = 1;
                self.onOffButton.textContent = 'OFF';
            }
        });
        ///////////////////////////////////////////////////////////add diffuse red color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseRed' style='width : 110px;'>" + name + "diffuseRed </label>\
        <input type='range' name='"+ name + "diffuseRed' id='" + name + "diffuseRed' min='0.0' max='1.0' step='0.01' value=" + this.o.diffuseColor[0] + ">\
        <span id='"+ name + "diffuseRedValue' style='width : 24px;'></span></div>");
        this.o.inputControlRed = document.getElementById(name + 'diffuseRed');
        this.o.displayRedValue = document.getElementById(name + 'diffuseRedValue');
        this.o.displayRedValue.textContent = this.o.diffuseColor[0];
        this.o.inputControlRed.addEventListener('input', function (event) {
            self.diffuseColor[0] = event.target.value;
            self.displayRedValue.textContent = event.target.value;
            self.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
            adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add diffuse green color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseGreen' style='width : 110px;'>" + name + "diffuseGreen </label>\
        <input type='range' name='"+ name + "diffuseGreen' id='" + name + "diffuseGreen' min='0.0' max='1.0' step='0.01' value=" + this.o.diffuseColor[1] + ">\
        <span id='"+ name + "diffuseGreenValue' style='width : 24px;'></span></div>");
        this.o.inputControlGreen = document.getElementById(name + 'diffuseGreen');
        this.o.displayGreenValue = document.getElementById(name + 'diffuseGreenValue');
        this.o.displayGreenValue.textContent = this.o.diffuseColor[1];
        this.o.inputControlGreen.addEventListener('input', function (event) {
            self.diffuseColor[1] = event.target.value;
            self.displayGreenValue.textContent = event.target.value;
            self.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
            adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add diffuse blue color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseBlue' style='width : 110px;'>" + name + "diffuseBlue </label>\
        <input type='range' name='"+ name + "diffuseBlue' id='" + name + "diffuseBlue' min='0.0' max='1.0' step='0.01' value=" + this.o.diffuseColor[2] + ">\
        <span id='"+ name + "diffuseBlueValue' style='width : 24px;'></span></div>");
        this.o.inputControlBlue = document.getElementById(name + 'diffuseBlue');
        this.o.displayBlueValue = document.getElementById(name + 'diffuseBlueValue');
        this.o.displayBlueValue.textContent = this.o.diffuseColor[2];
        this.o.inputControlBlue.addEventListener('input', function (event) {
            self.diffuseColor[2] = event.target.value;
            self.displayBlueValue.textContent = event.target.value;
            self.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, 1.0);
            adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add diffuse alpha color control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='" + name + "diffuseAlpha' style='width : 110px;'>" + name + "diffuseAlpha </label>\
        <input type='range' name='"+ name + "diffuseAlpha' id='" + name + "diffuseAlpha' min='0.0' max='1.0' step='0.01' value=" + this.o.alpha + ">\
        <span id='"+ name + "diffuseAlphaValue' style='width : 24px;'></span></div>");
        this.o.inputControlAlpha = document.getElementById(name + 'diffuseAlpha');
        this.o.displayAlphaValue = document.getElementById(name + 'diffuseAlphaValue');
        this.o.displayAlphaValue.textContent = this.o.alpha;
        this.o.inputControlAlpha.addEventListener('input', function (event) {
            self.alpha = event.target.value;
            self.displayAlphaValue.textContent = event.target.value;
            self.diffuseObjectColorDisplay.style.backgroundColor = colorByIntensityToStringRGB(self.diffuseColor, self.alpha);
            adaptBackgroundColor(self.diffuseObjectColorDisplay, self.diffuseColor, 1);
        });
        ///////////////////////////////////////////////////////////add position X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='position_X" + this.name + "' style='width : 110px;'>" + this.name + " pos X</label>\
        <input type='range' name='position_X"+ this.name + "' id='position_X" + this.name + "' min='-4.0' max='4.0' step='0.01' value=" + this.o.positionMatrix[12] + ">\
        <span id='position_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlPositionX = document.getElementById('position_X' + name);
        this.o.displayPositionXValue = document.getElementById('position_X' + name + 'Value');
        this.o.displayPositionXValue.textContent = this.o.positionMatrix[12];
        this.o.inputControlPositionX.addEventListener('input', function (event) {
            self.positionMatrix[12] = event.target.value;
            self.transformVertexArray();
            self.displayPositionXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add position Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='position_Y" + this.name + "' style='width : 110px;'>" + this.name + " pos Y</label>\
        <input type='range' name='position_Y"+ this.name + "' id='position_Y" + this.name + "' min='-4.0' max='4.0' step='0.01' value=" + this.o.positionMatrix[13] + ">\
        <span id='position_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlPositionY = document.getElementById('position_Y' + name);
        this.o.displayPositionYValue = document.getElementById('position_Y' + name + 'Value');
        this.o.displayPositionYValue.textContent = this.o.positionMatrix[13];
        this.o.inputControlPositionY.addEventListener('input', function (event) {
            self.positionMatrix[13] = event.target.value;
            self.transformVertexArray();
            self.displayPositionYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add position Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='position_Z" + this.name + "' style='width : 110px;'>" + this.name + " pos Z</label>\
        <input type='range' name='position_Z"+ this.name + "' id='position_Z" + this.name + "' min='-4.0' max='4.0' step='0.01' value=" + this.o.positionMatrix[14] + ">\
        <span id='position_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlPositionZ = document.getElementById('position_Z' + name);
        this.o.displayPositionZValue = document.getElementById('position_Z' + name + 'Value');
        this.o.displayPositionZValue.textContent = this.o.positionMatrix[14];
        this.o.inputControlPositionZ.addEventListener('input', function (event) {
            self.positionMatrix[14] = event.target.value;
            self.transformVertexArray();
            self.displayPositionZValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add scalar X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='scalar_X" + this.name + "' style='width : 110px;'>" + this.name + " sca X</label>\
        <input type='range' name='scalar_X"+ this.name + "' id='scalar_X" + this.name + "' min='" + this.o.minScale + "' max='" + this.o.maxScale + "' step='0.001' value=" + this.o.scalarMatrix[0] + ">\
        <span id='scalar_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlScalarX = document.getElementById('scalar_X' + name);
        this.o.displayScalarXValue = document.getElementById('scalar_X' + name + 'Value');
        this.o.displayScalarXValue.textContent = this.o.scalarMatrix[0];
        this.o.inputControlScalarX.addEventListener('input', function (event) {
            self.scalarMatrix[0] = event.target.value;
            self.transformVertexArray();
            self.displayScalarXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add scalar Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='scalar_Y" + this.name + "' style='width : 110px;'>" + this.name + " sca Y</label>\
        <input type='range' name='scalar_Y"+ this.name + "' id='scalar_Y" + this.name + "' min='" + this.o.minScale + "' max='" + this.o.maxScale + "' step='0.001' value=" + this.o.scalarMatrix[5] + ">\
        <span id='scalar_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlScalarY = document.getElementById('scalar_Y' + name);
        this.o.displayScalarYValue = document.getElementById('scalar_Y' + name + 'Value');
        this.o.displayScalarYValue.textContent = this.o.scalarMatrix[5];
        this.o.inputControlScalarY.addEventListener('input', function (event) {
            self.scalarMatrix[5] = event.target.value;
            self.transformVertexArray();
            console.log('mundodod');
            self.displayScalarYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add scalar Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='scalar_Z" + this.name + "' style='width : 110px;'>" + this.name + " sca Z</label>\
        <input type='range' name='scalar_Z"+ this.name + "' id='scalar_Z" + this.name + "' min='" + this.o.minScale + "' max='" + this.o.maxScale + "' step='0.001' value=" + this.o.scalarMatrix[10] + ">\
        <span id='scalar_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlScalarZ = document.getElementById('scalar_Z' + name);
        this.o.displayScalarZValue = document.getElementById('scalar_Z' + name + 'Value');
        this.o.displayScalarZValue.textContent = this.o.scalarMatrix[10];
        this.o.inputControlScalarZ.addEventListener('input', function (event) {
            self.scalarMatrix[10] = event.target.value;
            self.transformVertexArray();
            self.displayScalarZValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add total scalar control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display:flex;'>\
        <button id='enlarge"+ name + "'>enlarge</button>\
        <button id='shrink"+ name + "'>shrink</button>\
        <button id='resetScale"+ name + "'>reset scale</button></div>");
        this.enlargeButton = document.getElementById('enlarge' + name);
        this.shrinkButton = document.getElementById('shrink' + name);
        this.resetScaleButton = document.getElementById('resetScale' + name);
        this.enlargeButton.addEventListener('click', function () {
            if ((self.maxScale > self.scalarMatrix[0] * 1.05 && self.maxScale > self.scalarMatrix[5] * 1.05) && self.maxScale > self.scalarMatrix[10] * 1.05) {
                self.scalarMatrix[0] *= 1.05;
                self.scalarMatrix[5] *= 1.05;
                self.scalarMatrix[10] *= 1.05;
                self.transformVertexArray();
                self.inputControlScalarX.value = self.scalarMatrix[0];
                self.inputControlScalarY.value = self.scalarMatrix[5];
                self.inputControlScalarZ.value = self.scalarMatrix[10];
                self.displayScalarXValue.textContent = self.scalarMatrix[0];
                self.displayScalarYValue.textContent = self.scalarMatrix[5];
                self.displayScalarZValue.textContent = self.scalarMatrix[10];
            }
        });
        this.shrinkButton.addEventListener('click', function () {
            if ((self.minScale < self.scalarMatrix[0] / 1.05 && self.minScale < self.scalarMatrix[5] / 1.05) && self.minScale < self.scalarMatrix[10] / 1.05) {
                self.scalarMatrix[0] /= 1.05;
                self.scalarMatrix[5] /= 1.05;
                self.scalarMatrix[10] /= 1.05;
                self.transformVertexArray();
                self.inputControlScalarX.value = self.scalarMatrix[0];
                self.inputControlScalarY.value = self.scalarMatrix[5];
                self.inputControlScalarZ.value = self.scalarMatrix[10];
                self.displayScalarXValue.textContent = self.scalarMatrix[0];
                self.displayScalarYValue.textContent = self.scalarMatrix[5];
                self.displayScalarZValue.textContent = self.scalarMatrix[10];
            }
        });
        this.resetScaleButton.addEventListener('click', function () {

            self.scalarMatrix[0] = 1.0;
            self.scalarMatrix[5] = 1.0;
            self.scalarMatrix[10] = 1.0;
            self.transformVertexArray();
            self.inputControlScalarX.value = self.scalarMatrix[0];
            self.inputControlScalarY.value = self.scalarMatrix[5];
            self.inputControlScalarZ.value = self.scalarMatrix[10];
            self.displayScalarXValue.textContent = self.scalarMatrix[0];
            self.displayScalarYValue.textContent = self.scalarMatrix[5];
            self.displayScalarZValue.textContent = self.scalarMatrix[10];
        });
        ///////////////////////////////////////////////////////////add angle X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ang_X" + this.name + "' style='width : 110px;'>" + this.name + " world ang X</label>\
               <input type='range' name='ang_X"+ this.name + "' id='ang_X" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.angleX + ">\
               <span id='ang_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngX = document.getElementById('ang_X' + this.name);
        this.o.displayAngXValue = document.getElementById('ang_X' + this.name + 'Value');
        this.o.displayAngXValue.textContent = this.o.angleX;
        this.o.inputControlAngX.addEventListener('input', function (event) {
            orientViewX(self, event.target.value);
            self.displayAngXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add angle Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ang_Y" + this.name + "' style='width : 110px;'>" + this.name + " world ang Y</label>\
               <input type='range' name='ang_Y"+ this.name + "' id='ang_Y" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.angleY + ">\
               <span id='ang_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngY = document.getElementById('ang_Y' + this.name);
        this.o.displayAngYValue = document.getElementById('ang_Y' + this.name + 'Value');
        this.o.displayAngYValue.textContent = this.o.angleY;
        this.o.inputControlAngY.addEventListener('input', function (event) {
            orientViewY(self, event.target.value);
            self.displayAngYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add angle Z control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ang_Z" + this.name + "' style='width : 110px;'>" + this.name + " world ang Z</label>\
               <input type='range' name='ang_Z"+ this.name + "' id='ang_Z" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.angleZ + ">\
               <span id='ang_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlAngZ = document.getElementById('ang_Z' + this.name);
        this.o.displayAngZValue = document.getElementById('ang_Z' + this.name + 'Value');
        this.o.displayAngZValue.textContent = this.o.angleZ;
        this.o.inputControlAngZ.addEventListener('input', function (event) {
            orientViewZ(self, event.target.value);
            self.displayAngZValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add own angle X control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ownang_X" + this.name + "' style='width : 110px;'>" + this.name + " own ang X</label>\
               <input type='range' name='ownang_X"+ this.name + "' id='ownang_X" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.ownAngleX + ">\
               <span id='ownang_X"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlOwnAngX = document.getElementById('ownang_X' + this.name);
        this.o.displayOwnAngXValue = document.getElementById('ownang_X' + this.name + 'Value');
        this.o.displayOwnAngXValue.textContent = this.o.ownAngleX;
        this.o.inputControlOwnAngX.addEventListener('input', function (event) {
            rotateOwnAxisX(self, event.target.value);
            self.displayOwnAngXValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add own angle Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ownang_Y" + this.name + "' style='width : 110px;'>" + this.name + " own ang Y</label>\
               <input type='range' name='ownang_Y"+ this.name + "' id='ownang_Y" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.ownAngleY + ">\
               <span id='ownang_Y"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlOwnAngY = document.getElementById('ownang_Y' + this.name);
        this.o.displayOwnAngYValue = document.getElementById('ownang_Y' + this.name + 'Value');
        this.o.displayOwnAngYValue.textContent = this.o.ownAngleY;
        this.o.inputControlOwnAngY.addEventListener('input', function (event) {
            rotateOwnAxisY(self, event.target.value);
            self.displayOwnAngYValue.textContent = event.target.value;
        });
        ///////////////////////////////////////////////////////////add own angle Y control
        this.o.panel.insertAdjacentHTML("beforeend", "<div style='display: flex;'><label for='ownang_Z" + this.name + "' style='width : 110px;'>" + this.name + " own ang Z</label>\
               <input type='range' name='ownang_Z"+ this.name + "' id='ownang_Z" + this.name + "' min='-2' max='2' step='0.01' value=" + this.o.ownAngleZ + ">\
               <span id='ownang_Z"+ name + "Value' style='width : 24px;'></span></div>");
        this.o.inputControlOwnAngZ = document.getElementById('ownang_Z' + this.name);
        this.o.displayOwnAngZValue = document.getElementById('ownang_Z' + this.name + 'Value');
        this.o.displayOwnAngZValue.textContent = this.o.ownAngleZ;
        this.o.inputControlOwnAngZ.addEventListener('input', function (event) {
            rotateOwnAxisZ(self, event.target.value);
            self.displayOwnAngZValue.textContent = event.target.value;
        });
    }
    refresh() {
        this.o.inputControlRed.value = this.o.diffuseColor[0];
        this.o.inputControlGreen.value = this.o.diffuseColor[1];
        this.o.inputControlBlue.value = this.o.diffuseColor[2];
        this.o.inputControlPositionX.value = this.o.positionMatrix[12];
        this.o.inputControlPositionY.value = this.o.positionMatrix[13];
        this.o.inputControlPositionZ.value = this.o.positionMatrix[14];
        this.o.inputControlScalarX.value = this.o.scalarMatrix[0];
        this.o.inputControlScalarY.value = this.o.scalarMatrix[5];
        this.o.inputControlScalarZ.value = this.o.scalarMatrix[10];
        this.o.inputControlAngX.value = this.o.angleX;
        this.o.inputControlAngY.value = this.o.angleY;
        this.o.inputControlAngZ.value = this.o.angleZ;
        this.o.inputControlOwnAngX.value = this.o.ownAngleX;
        this.o.inputControlOwnAngY.value = this.o.ownAngleY;
        this.o.inputControlOwnAngZ.value = this.o.ownAngleZ;
    }
}