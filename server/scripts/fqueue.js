
(function(scope){
	function fQueue(capacity) {
		capacity = capacity || 8192;

		var array = new Array(capacity);
		var size = 0;
		var first = 0;
		var last = -1;

		function enqueue(item){
			size ++;
			last ++;

			if (last == capacity)
				last = 0;
			if (size > capacity) 
				dequeue();

			array[last] = item;
		}

		function dequeue() {
			if (size == 0)
				return undefined;

			item = array[first];
			first ++;
			size --;

			if (first == capacity)
				first = 0;

			return item;
		}

		this.enqueue = enqueue;
		this.dequeue = dequeue;
		this.size = function() { return size; };
	}

	scope.fQueue = fQueue;
})(window);
