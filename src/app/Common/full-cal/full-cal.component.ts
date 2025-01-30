import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent,CalendarOptions, EventInput } from '@fullcalendar/angular';
import * as moment from 'moment'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

@Component({
  selector: 'app-full-cal',
  templateUrl: './full-cal.component.html',
  styleUrls: ['./full-cal.component.css']
})
export class FullCalComponent implements OnInit {
  @ViewChild('calendar',{static:false}) calComponent: FullCalendarComponent;
  constructor() { }

  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  CalenderHeader = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    color: "red"
  };
  eventLimit: boolean = true; // for all non-TimeGrid views
  views: any = {
    timeGrid: {
      eventLimit: 20 // adjust to 6 only for timeGridWeek/timeGridDay
    }
  }
  ngOnInit() {
  }
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.DateClick.bind(this), // bind is important!
    eventClick: this.EventClick.bind(this),
    events: [],
    lazyFetching:false,
    height:500
  }; 
 
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() }
  ];
  
  _events: EventInput[] =[{
    start: new Date(),
    title:"My Event",
    // display: 'background',
    backgroundColor:"red"
  }]
  ngAfterViewInit(){
    setTimeout(() => {
    // $('#calendar').fullCalendar()
    this.calendarOptions.events = this._events
    }, 150);
  }
  clickButton(model: any) {
    console.log(model);
  }
  DateClick(arg) {
   console.log(arg)
  }

  EventClick(model: any) {
    model.jsEvent.preventDefault();
    console.log(model.event.extendedProps)

  }
}
