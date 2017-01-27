$(function(){
    var filemanager = $('.filemanager'),
        header = $('.header'),
		breadcrumbs = $('.breadcrumbs'),
        sidebar = $('.sidebar'),
		fileList = filemanager.find('.data');
    
    var url,
        currentFile;
    
	// Start by fetching the file data from files.json with an AJAX request    
	$.get('files.json', function(data) {        
		var response = [data],
			currentPath = '',
			breadcrumbsUrls = [];
        
		var folders = [],
			files = [];

		// Monitor changes on the URL, to capture back/forward navigation in the browser.
		$(window).on('hashchange', function(){
			goto(window.location.hash);
		}).trigger('hashchange');

		// Listen for keyboard input on the search field.
		header.find('input').on('input', function(e){
			folders = [];
			files = [];

			var value = this.value.trim();

			if(value.length) {
				filemanager.addClass('searching');

				// Update the hash on every key stroke
				window.location.hash = 'search=' + value.trim();
			}
			else {
				filemanager.removeClass('searching');
				window.location.hash = encodeURIComponent(currentPath);
			}
		}).on('keyup', function(e){
			// Clicking 'ESC' button triggers focusout and cancels the search
			var search = $(this);

			if(e.keyCode == 27) {
				search.trigger('focusout');
			}
		});

        // TODO: dblclick
		// Clicking on folders
		fileList.on('click', 'span.folders', function(e) {
			e.preventDefault();

			var nextDir = $(this).find('a.folder').attr('href');

			if(filemanager.hasClass('searching')) {
				// Building the breadcrumbs
				breadcrumbsUrls = generateBreadcrumbs(nextDir);

				filemanager.removeClass('searching');
				filemanager.find('input[type=search]').val('').hide();
				filemanager.find('span').show();
			}
			else {
				breadcrumbsUrls.push(nextDir);
			}

			window.location.hash = encodeURIComponent(nextDir);
			currentPath = nextDir;
		});
        
        // Clicking on files
        fileList.on('click', 'span.files', function(e) {
            e.preventDefault();
            
            var fileName = $(this).find('p.filename').html();
            var fullFilePath = $(this).find('a.icon.file').attr('href');
            
            var filePath = fullFilePath.substr(5);
            
            sidebar.html('<p class="fileInfo">' + fileName + '</p><img class="filePreview" src="' + filePath + '"><div class="buttons"><a class="button download" href="' + fullFilePath + '" download="' + fileName + '">Download</a><a class="button rename" href="#">Rename</a><a class="button delete" href="#">Delete</a></div>');
                        
            url = fullFilePath;
            currentFile = $(this);
        });
        
        // Deleting files
        sidebar.on('click', '.button.delete', function(e) {
            e.preventDefault();
            
            $.post(url, { Instruction: "Delete" }).done(function(data) {
                // TODO: solve exceptions here
            });
            
            location.reload();
        });
        
        // Renaming files
        sidebar.on('click', '.button.rename', function(e) {
            e.preventDefault();
            
            // TODO: check me (.format)
            var newName = prompt("Enter new name", currentFile.find('p.filename').html());
            
            $.post(url, { Instruction: "Rename", Name: newName })
                .done(function(data) {
            });
            
            location.reload();
        });
        
		// Clicking on breadcrumbs
		breadcrumbs.on('click', 'a', function(e){
			e.preventDefault();

			var index = breadcrumbs.find('a').index($(this)),
				nextDir = breadcrumbsUrls[index];

			breadcrumbsUrls.length = Number(index);

			window.location.hash = encodeURIComponent(nextDir);
		});

		// Navigate to the given hash (path)
		function goto(hash) {
			hash = decodeURIComponent(hash).slice(1).split('=');

			if (hash.length) {
				var rendered = '';

				// if hash has search in it
				if (hash[0] === 'search') {
					filemanager.addClass('searching');
					rendered = searchData(response, hash[1].toLowerCase());

					if (rendered.length) {
						currentPath = hash[0];
						render(rendered);
					}
					else {
						render(rendered);
					}
				}

				// if hash is some path
				else if (hash[0].trim().length) {
					rendered = searchByPath(hash[0]);

					if (rendered.length) {
						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);
					}
					else {
						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);
					}
				}

				// if there is no hash
				else {
					currentPath = data.path;
					breadcrumbsUrls.push(data.path);
					render(searchByPath(data.path));
				}
			}
		}

		// Split a file path and turn it into clickable breadcrumbs
		function generateBreadcrumbs(nextDir){
			var path = nextDir.split('/').slice(0);
			for(var i=1;i<path.length;i++){
				path[i] = path[i-1]+ '/' +path[i];
			}
			return path;
		}

		// Locate a file by path
		function searchByPath(dir) {
			var path = dir.split('/'),
				demo = response,
				flag = 0;

			for(var i=0;i<path.length;i++){
				for(var j=0;j<demo.length;j++){
					if(demo[j].name === path[i]){
						flag = 1;
						demo = demo[j].items;
						break;
					}
				}
			}

			demo = flag ? demo : [];
			return demo;
		}

		// Recursively search through the file tree
		function searchData(data, searchTerms) {
			data.forEach(function(d){
				if(d.type === 'folder') {
					searchData(d.items,searchTerms);

					if(d.name.toLowerCase().match(searchTerms)) {
						folders.push(d);
					}
				}
				else if(d.type === 'file') {
					if(d.name.toLowerCase().match(searchTerms)) {
						files.push(d);
					}
				}
			});
			return {folders: folders, files: files};
		}

		// Render the HTML for the file manager
		function render(data) {
			var scannedFolders = [],
				scannedFiles = [];

			if(Array.isArray(data)) {
				data.forEach(function (d) {
					if (d.type === 'folder') {
						scannedFolders.push(d);
					}
					else if (d.type === 'file') {
						scannedFiles.push(d);
					}
				});
			}
			else if(typeof data === 'object') {
				scannedFolders = data.folders;
				scannedFiles = data.files;
			}

			// Empty the old result and make the new one
			fileList.empty().hide();

			if(!scannedFolders.length && !scannedFiles.length) {
				filemanager.find('.nothingfound').show();
			}
			else {
				filemanager.find('.nothingfound').hide();
			}

			if(scannedFolders.length) {
				scannedFolders.forEach(function(f) {
					var itemsLength = f.items.length,
						name = escapeHTML(f.name),
                        icon = getFolderIcon(itemsLength);

//					if(itemsLength == 1) {
//						itemsLength += ' item';
//					}
//					else if(itemsLength > 1) {
//						itemsLength += ' items';
//					}
//					else {
//						itemsLength = 'Empty';
//					}

                    var folder = $('<span class="folders"><a href="' + f.path + '" title="' + f.path + '" class="icon folder">' + icon + '<p class="filename">' + name + '</p></a></span>');
//                    var folder = $('<a href="' + f.path + '" class="icon folder">' + icon + name + '</a>');
					folder.appendTo(fileList);
				});
			}

			if(scannedFiles.length) {
				scannedFiles.forEach(function(f) {
					var fileSize = bytesToSize(f.size),
						name = escapeHTML(f.name),
						fileType = name.split('.'),
                        icon = getFileIcon(fileType[fileType.length - 1]);
                    
                    var file = $('<span class="files"><a href="' + f.path + '" title="' + f.path + '" class="icon file">' + icon + '<p class="filename">' + name + '</p></a></span>');
                    
					file.appendTo(fileList);
				});
			}

			// Generate the breadcrumbs
			var url = '';

			if(filemanager.hasClass('searching')){
				url = '<span>Search results: </span>';
				fileList.removeClass('animated');
			}
			else {
				fileList.addClass('animated');

				breadcrumbsUrls.forEach(function (u, i) {
					var name = u.split('/');

					if (i !== breadcrumbsUrls.length - 1) {
						url += '<a href="' + u + '"><span class="folderName">' + name[name.length-1] + '</span></a> <span class="arrow">' + '\u2192' + '</span> ';
					}
					else {
						url += '<span class="folderName">' + name[name.length-1] + '</span>';
					}
				});
			}

			breadcrumbs.text('').append(url);

			// Show the generated elements
			fileList.animate({'display':'inline-block'});
		}
        
        // Return an .svg image representing a folder
        function getFolderIcon(full) {    
            var content = full ? '<rect fill="#fff"x="3"y="12"height="35"width="47"rx="2"/>' : '';

            return '<svg viewBox="0 0 53 53" class="vector"><rect fill="#d9b61d"x="1.5"y="5"width="25"height="45"rx="2"/><rect fill="#d9b61d"x="1.5"y="10"width="50"height="40"rx="2"/>' + content + '<rect fill="#edc44a"x="1.5"y="15"width="50"height="35"rx="2"/></svg>';
        }
        
        // Return an .svg image representing a file
        function getFileIcon(format) {
            return '<svg viewBox="0 0 53 53" class="vector"><path d="M12.4 3A-2.4 2.4,0,0,0 10 5.4L10 47.6A2.4 2.9 0,0,0 12.4 50L42.6 50A2.9 -2.4,0,0,0 45 47.6L45 17 31 3 12.4 3"fill="' + getColors(format)[0] + '"/><path d="M45 17L31 3 31 14.6A2.4 2.4,0,0,0 33.4 17L45 17"fill="' + getColors(format)[1] + '"/><text text-anchor="middle"font-family="sans-serif"font-size="12"y="33"x="26.5"fill="#fff">.' + format + '</text></svg>';
        }
        
        // Return icon color
        function getColors(format) {
            switch(format) {
                case 'avi':
                case 'flv':
                case 'mkv':
                case 'mov':
                case 'mpeg':
                case 'mpg':
                case 'mp4':
                case 'm4v':
                case 'wmv':
                    return ['#7e70ee', '#5649c1'];
                case 'mp2':
                case 'mp3':
                case 'm3u':
                case 'wma':
                case 'xls':
                case 'xlsx':
                    return ['#5bab6e', '#448353'];
                case 'doc':
                case 'docx':
                case 'psd':
                    return ['#03689b', '#2980b9'];
                case 'gif':
                case 'jpg':
                case 'jpeg':
                case 'pdf':
                case 'png':
                    return ['#e15955', '#c6393f'];
                case 'bmp':
                    return ['#7adfed', '#649fab'];
                case 'deb':
                case 'dmg':
                case 'gz':
                case 'rar':
                case 'zip':
                case '7z':
                    return ['#867c75', '#685f58'];
                case 'html':
                case 'rtf':
                case 'xml':
                case 'xhtml':
                    return ['#a94bb7', '#d65de8'];
                case 'js':
                    return ['#d0c54d', '#a69f4e'];
                case 'css':
                case 'sass':
                case 'scss':
                    return ['#44afa6', '#30837c'];
                default:
                    return ['#898989', '#cbcbcb'];
            }
        }

		// Escapes special html characters in names
		function escapeHTML(text) {
			return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
		}

		// Convert file sizes from bytes to human readable units
		function bytesToSize(bytes) {
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes == 0) return '0 Bytes';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		}
	});
});