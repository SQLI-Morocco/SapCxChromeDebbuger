# SapCxChromeDebbuger


1- Clone source or download zip from gitHub

2- Take the downloaded ZIP file and extract it. We need to give it a permanent home because Chrome will externally load the files (if they get moved/deleted then the extension will stop working).

3- With the extension downloaded and extracted, we can now install it.In Chrome

4- navigate to chrome://extensions and turn on "Developer mode"

5- drag-and-drop the src we extracted onto Chrome’s Extensions page. Or click "Load unpacked" button and navivigate to the folder you downloaded from GitHub.

6- make sure that the extension is activated.

7-in the options of the extension you must configure the regex of your Front store and the url of your backoffice
    Environment ( regEx) :  
        ->  Environment ( regEx) : powertools\.*
                repalce powertools by your storeFront Url  (example : if my sotre front url is www.mystorefront.local.com   =>  mystorename\.*)
        ->  backoffice URL : https://localhost:9002/backoffice/
                        repalce this url by your backoffice Url
                        





/!\ To activate all the options of the extension you must modify in your project (source code)


1- in the projectNamestorefront/web/webroot/WEB-INF/tags/shared/debug/debugFooter.tag  file 
   inside the tag <c:if test="${showStorefrontDebugInfo}"> 
      add the following lines  :
      
        cmsPagePK=${fn:escapeXml(cmsPage.pk)}
        cmsSitePK=${fn:escapeXml(cmsSite.pk)}
        baseStoreUid=${fn:escapeXml(cmsSite.stores[0].uid)}
        baseStorePK=${fn:escapeXml(cmsSite.stores[0].pk)}
        ProductCode=${fn:escapeXml(product.code)}
        ProductPk=${fn:escapeXml(product.pk)}


2- add <property name="pk" type="java.lang.String"/> in your bean <bean class="de.hybris.platform.commercefacades.product.data.ProductData">
   in projectNamefacades-beans.xml file.


3- in your ProductPopulator.java
   add  productData.setPk(productSource.getPk().toString());



!!!! Enjoy It !!!!

