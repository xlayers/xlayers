import { TestBed } from '@angular/core/testing';
import { StyleOptimizerService } from './style-optimizer.service';



describe('CSS Optimizer', () => {
  let cssOptimizer: StyleOptimizerService;
  beforeEach((() => {
    TestBed.configureTestingModule({
      providers: [StyleOptimizerService]
    });
  }));

  beforeEach(() => {
    cssOptimizer = TestBed.get(StyleOptimizerService);
  });
  it('should combine duplicate css part', () => {
    const styles = [
      { className: 'A_class', declarations: ['display: block', 'color: red'] },
      { className: 'B_class', declarations: ['display: block', 'margin-left: 2px'] }
    ];
    cssOptimizer.postProcessCss(styles);

    expect(styles).toEqual([
      { className: 'A_class', declarations: ['color: red'] },
      { className: 'B_class', declarations: ['margin-left: 2px'] },
      { className: 'A_class, .B_class', declarations: ['display: block'] }]);
  });
  it('should combine duplicate over muplitple css part', () => {
    const styles = [
      {
        className: 'xly_2r92, .xly_51i6', declarations: ['display: block',
          'position: absolute',
          'visibility: visible']
      },
      { className: 'B_class', declarations: ['display: block', 'margin-left: 2px'] },
      {
        className: 'xly_1r12, .xly_2id6', declarations: ['display: block',
          'position: absolute',
          'visibility: visible']
      },
    ];
    cssOptimizer.postProcessCss(styles);
    expect(styles).toEqual([
      { className: 'xly_2r92, .xly_51i6', declarations: [] },
      { className: 'B_class', declarations: ['margin-left: 2px'] },
      { className: 'xly_1r12, .xly_2id6', declarations: ['display: block'] },
      { className: 'xly_2r92, .xly_51i6, .B_class', declarations: ['display: block'] },
      {
        className: 'xly_2r92, .xly_51i6, .xly_1r12, .xly_2id6',
        declarations: ['position: absolute', 'visibility: visible']
      }]);
  });
});
