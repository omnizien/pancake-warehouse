import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {homeRoutingModule } from '../home/home-routing.module';
import { HomeComponent } from '../home/home.component';
import { ArbitrageService } from '../providers/arbitrage.service';
 
 
 

@NgModule({
  imports: [
    CommonModule,
    homeRoutingModule,
    FormsModule 
    
  ],
  providers: [ ArbitrageService],
  declarations: [HomeComponent]
})
export class HomeModule {

    constructor() {
        console.log("home active");
    }
 
}
