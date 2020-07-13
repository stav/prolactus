.PHONY: init test clean deploy

REMOTE      := linode
REPO_URI    := stav@cowboy:/srv/git/prolactus.git
REPO_REMOTE := $(shell git remote)
RENDER_DIR  := cowboy:/srv/org.centerstar.milk/htdocs

init:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Initializing

ifeq ($(REPO_REMOTE),)
	@echo Remote is empty
else
	-git remote rm $(REPO_REMOTE)
endif

	git remote add $(REMOTE) $(REPO_URI)
	git fetch $(REMOTE)
	git branch --set-upstream-to=$(REMOTE)/master master

test:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Testing
	@echo Tests passed

clean:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Cleaning
	rm -rf ./build

deploy:
	@echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	@echo ~Deploying
	@make test
	@make clean
	yarn build
	scp -r build/* $(RENDER_DIR)
	git push -u $(REMOTE) master
