import { Component, computed, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-dialog',
  imports: [DialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  visible = input.required<boolean>();
  visibleChange = output<boolean>();
  header = input('');
  size = input<'full' | 'normal' | 'small'>('full');
  fullScreen = input<boolean>(false);

  dialogStyle() {
    if (this.size() === 'full') {
      return {
        width: '100%',
        maxWidth: '700px',
        height: 'auto',
        borderRadius: '6px',
      };
    }

    if (this.size() === 'small') {
      return { width: '400px' };
    }

    return { width: '600px' };
  }
  

  dialogBreakpoints() {
    if (this.size() === 'full') {
      return {
        '575px': '100vw'
      };
    }

    return {
      '1199px': this.size() === 'small' ? '60vw' : '75vw',
      '575px': this.size() === 'small' ? '85vw' : '100vw'
    };
  }
  
  

  
}
