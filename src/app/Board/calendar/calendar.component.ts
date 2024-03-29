import { Component } from '@angular/core';
import { Locale } from '@Schoolingo/Locale';

@Component({
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css', '../board.css']
})
export class CalendarComponent {
  constructor(
    public locale: Locale
  ) {}
}
