import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxChartsModule } from '@swimlane/ngx-charts';
//  import { multi } from '../data';
import { JsonEncoderService } from '../workers/json-encoder.service';
export var multi = [
  {
    "name": "Germany",
    "series": [
      {
        "name": "january",
        "value": 620 
      },
      {
        "name": "reb",
        "value": 730 
      },
      {
        "name": "march",
        "value": 894 
      }
    ]
  } ]

 
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineChartComponent  {
  
  multi : any[] = [];
 

  um:[]=[]
  view: [number,number] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor( ) {
  //  this. um[this.multi]

    Object.assign(this, { multi });
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  lineChart(val1:number, val2:number, val3:number) {
   
    let date: Date = new Date();  
         
      this.multi[0].series.push({ name: date.	getTime().toString(), value: val1 });
      this.multi[0].series.push({ name: date.	getTime().toString(), value: val2 });
      this.multi[0].series.push({ name: date.	getTime().toString(), value: val3 });
      
    console.log(this.multi)
    this.multi = [...this.multi];
 

  }

}
