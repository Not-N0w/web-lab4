import { Component, inject } from '@angular/core';
import { CoordinatePlate } from '../../components/coordinate-plate/coordinate-plate';
import { HitForm } from '../../components/hit-form/hit-form';
import { HitsTable } from '../../components/hits-table/hits-table';

@Component({
  selector: 'app-main-page',
  imports: [CoordinatePlate, HitForm, HitsTable],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {}
