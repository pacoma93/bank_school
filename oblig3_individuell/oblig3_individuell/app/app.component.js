"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
require("rxjs/add/operator/map");
var laan_1 = require("./laan");
var http_2 = require("@angular/http");
var AppComponent = (function () {
    function AppComponent(_http, fb) {
        this._http = _http;
        this.fb = fb;
        this.laan = new laan_1.Laan();
        this.resetform();
    }
    AppComponent.prototype.ngOnInit = function () {
        this.visKalkulator = true;
        this.visRegForm = false;
        this.visListe = false;
        this.hent_soknader(); //henter opp søknader tidligere
        this.standardVerdier(); //setter på standardverdier til kalkulator
    };
    AppComponent.prototype.resetform = function () {
        this.skjema = this.fb.group({
            belop: [""],
            nedbetaling: [""],
            perMnd: [""],
            rente: [""],
            personnr: ["", forms_1.Validators.pattern("[0-9]{11}")],
            telefon: ["", forms_1.Validators.pattern("[0-9]{8}")],
            epost: ["", forms_1.Validators.pattern("[\\w\\.\\-\\_]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}")]
        });
    };
    AppComponent.prototype.standardVerdier = function () {
        this.laan.grunnbelop = "20000";
        this.laan.aar = "5";
        this.laan.sumPrMnd = this.beregnLaan();
    };
    AppComponent.prototype.sjekkPersonnr = function () {
        var sjekk = jQuery.inArray($('#Persnummer').val(), this.Pnummer);
        if (sjekk == -1) {
            this.personnrSjekk = false;
        }
        else {
            this.personnrSjekk = true;
        }
    };
    AppComponent.prototype.registrerlaan = function () {
        this.laan.grunnbelop = $('#myRange').val();
        this.laan.aar = $('#myRangeYear').val();
        ;
        this.laan.sumPrMnd = $('#prisPerM').html();
        this.laan.rentefot = $('#rentelaan').html();
        this.resetform();
        this.skjemaStatus = "Registrere";
        this.visKalkulator = false;
        this.visListe = false;
        this.visRegForm = true;
        this.skjema.patchValue({ personnr: "" });
        this.skjema.patchValue({ telefon: "" });
        this.skjema.patchValue({ epost: "" });
    };
    AppComponent.prototype.vislaanListe = function () {
        this.visKalkulator = false;
        this.visListe = true;
        this.visRegForm = false;
    };
    AppComponent.prototype.kalkulatorside = function () {
        this.visListe = false;
        this.visRegForm = false;
        this.visKalkulator = true;
    };
    AppComponent.prototype.verdi = function () {
        var verdi = $('#myRange').val();
        this.laan.grunnbelop = verdi;
        var text = this.beregnLaan();
        this.laan.sumPrMnd = text;
    };
    AppComponent.prototype.verdiaar = function () {
        var verdi = $('#myRangeYear').val();
        this.laan.aar = verdi;
        var text = this.beregnLaan();
        this.laan.sumPrMnd = text;
    };
    AppComponent.prototype.beregnLaan = function () {
        var r = 0.07; //rente
        var G = this.laan.grunnbelop; //grunnbeløp
        var n = this.laan.aar; // antall år
        var x = (r * +G); //utregner lånebeløp i måned
        var z = 1 - Math.pow((1 + r), -n);
        var y = (x / z) / 12;
        var text = y.toFixed(2);
        return text;
    };
    AppComponent.prototype.hent_soknader = function () {
        var _this = this;
        this._http.get("api/laan/")
            .map(function (returData) {
            var JsonData = returData.json();
            return JsonData;
        })
            .subscribe(function (JsonData) {
            _this.liste = [];
            _this.Pnummer = [];
            if (JsonData) {
                for (var _i = 0, JsonData_1 = JsonData; _i < JsonData_1.length; _i++) {
                    var soknad = JsonData_1[_i];
                    _this.liste.push(soknad);
                    _this.Pnummer.push(soknad.personnr);
                }
            }
            ;
        }, function (error) { return alert(error); }, function () { return console.log("ferdig med å hente søknader!"); });
    };
    AppComponent.prototype.lagreSoknad = function () {
        var _this = this;
        $("#vente").html("vennligst vent...");
        var laanet = new laan_1.Laan();
        laanet.sumPrMnd = this.laan.sumPrMnd;
        laanet.rentefot = this.laan.rentefot;
        laanet.grunnbelop = this.laan.grunnbelop;
        laanet.aar = this.laan.aar;
        laanet.personnr = this.skjema.value.personnr;
        laanet.telefon = this.skjema.value.telefon;
        laanet.epost = this.skjema.value.epost;
        var body = JSON.stringify(laanet);
        var headers = new http_2.Headers({ "Content-Type": "application/json" });
        this._http.post("api/laan", body, { headers: headers })
            .map(function (returData) { return returData.toString(); })
            .subscribe(function (retur) {
            $('#Moverskrift').html("Takk for registrering"); //modal får text
            $("#textbeststill").html("Søknaden er registrert. vi vil ta kontakt så snart søknaden er behandlet!");
            _this.hent_soknader();
            _this.visKalkulator = true;
            _this.visListe = false;
            _this.visRegForm = false;
            _this.standardVerdier();
        }, function (error) {
            $('#Moverskrift').html("Error");
            $("#textbeststill").html("feil i registrering. søknad ikke registrert!");
            _this.kalkulatorside();
        }, function () { return console.log("ferdig med å lagre søknad!"); });
    };
    AppComponent.prototype.vedSubmit = function () {
        if (this.skjemaStatus == "Registrere") {
            this.lagreSoknad();
        }
        else if (this.skjemaStatus == "Endre") {
        }
        else {
            alert("Feil i applikasjonen!");
        }
    };
    AppComponent.prototype.fjern = function () {
        this.kalkulatorside();
        $("#laanbelop").html(this.laan.grunnbelop);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: "./app/app.component.html"
        }), 
        __metadata('design:paramtypes', [http_1.Http, forms_1.FormBuilder])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map