var applyFilters = function ($table, filterFoo) {
	$table.find('> tbody > tr').each(function (){
		$this = $(this);

		var show = true;

		for (var idx in filterFoo) {
			var search = filterFoo[idx];

			if (search == '') {
				continue;
			}

			var td = $this.find('> td:nth-child(' + (+idx + 1) +  ')')[0];

			var elText = (td.textContent || td.innerText || '').toUpperCase();

			if (elText.indexOf(search) == -1) {
				show = false;
				break;
			}
		}

		show ? $this.show() : $this.hide();
	});
};

var makeTableFilterable = function (table) {
	var $table = $(table);

	// already filterable?
	if ($table.attr('data-filterable')) {
		return;
	}

	$table.attr('data-filterable', 1);

	var filterFoo = {};

	// gather all columns that have a filter
	$table.find('thead th.filterable').each(function (){
		var $this = $(this);

		var indexInParent = $this.index();

		var text = $this.text();

		filterFoo[indexInParent] = '';

		var $input = $('<input class="form-control" type="text" />')
			.attr('placeholder', text)
			.attr('data-colindex', indexInParent);

		$input.on('keyup', function (){
			var colIndex = +this.getAttribute('data-colindex');

			filterFoo[colIndex] = this.value.toUpperCase();

			applyFilters($(this).closest('table'), filterFoo);
		});

		$this.empty().append($input);
	});
};

$(document).ready(function () {
	$('th.filterable').each(function (){
		makeTableFilterable($(this).closest('table'));
	});
});
