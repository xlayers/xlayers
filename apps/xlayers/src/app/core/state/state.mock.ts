import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

@State({ name: 'mock' })
@Injectable()
export class XStore {}
