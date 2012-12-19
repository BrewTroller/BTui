#BrewTroller Live Recipe Download Script
# Eric Yanush March 2012

#Script takes POST form data, [name, data]
# name is the target filename
# data is the client generated BeerXML document, string encoded
# script returns Recipe data as a forced download, to allow for BrewTroller Live web-app to export BeerXML documents from the BrewTroller

#!/usr/bin/python
import cgi #import cgi module
import cgitb #import the cgi traceback module
import os
import sys

cgitb.enable() #enable cgi error tracebacks

def main():
  form = cgi.FieldStorage(fp=sys.stdin, environ=os.environ) #parse the form data
  if form.has_key("name") and form["name"].value != "" and form.has_key("data") and form["data"].value != "": #ensure that it is well-formed
    print "Access-Control-Allow-Origin: *" #return the CORS header
    print "Content-Disposition: attachment; filename=\""+form["name"].value+".xml\";\r"; #return content-disposition header, to force file download
    print "Content-Type:application/octet-stream;\r\n"; #set the mime-type to application/octet-stream to prevent browser from trying to just display the xml
    print form["data"].value #return the recipe data
  else: #the form data was not well formed, so there is an error
    print "Content-type: text/html\n"
    print "<h1>Holy unforseen errors Batman!</h1>"
    print "<h2>We have encountered an error, sorry for the inconvienve</h2>"
main()