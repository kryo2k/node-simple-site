require 'toolkit'
require 'susy'
require 'breakpoint'

nss_base_path = File.dirname(__FILE__)

Compass::Frameworks.register("nss",
	:path => nss_base_path,
	:stylesheets_directory => File.join(nss_base_path,"scss")
)

# TODO: special configs here
