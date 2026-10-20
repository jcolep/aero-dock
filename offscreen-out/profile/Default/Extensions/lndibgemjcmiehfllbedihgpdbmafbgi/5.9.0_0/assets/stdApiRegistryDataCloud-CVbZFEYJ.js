var n={generatedAt:"2025-01-21T23:58:37.693Z",items:[{id:"Brobench/Data Cloud/Metadata API/Global Metadata",name:"Global Metadata",folder:"Brobench/Data Cloud/Metadata API",description:`The Metadata API response includes metadata about all entities, including Calculated Insights, Engagement, Profile, and other entities, as well as their relationships to other objects.

[https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_metadata_api.htm](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_metadata_api.htm)`,type:"data_cloud",method:"GET",path:"/api/v1/metadata",bodyType:"raw",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Metadata",body:`{
    "metadata": [
        {
            "fields": [
                {
                    "name": "Birthdate__c",
                    "displayName": "Birthdate",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "cdp_sys_SourceVersion__c",
                    "displayName": "cdp_sys_SourceVersion",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "DataSource__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "DataSourceObject__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Email__c",
                    "displayName": "Email",
                    "type": "STRING",
                    "businessType": "EMAIL"
                },
                {
                    "name": "FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Id__c",
                    "displayName": "Contact ID",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "KQ_Id__c",
                    "displayName": "KQ_Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "MailingCity__c",
                    "displayName": "Mailing City",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "MailingCountry__c",
                    "displayName": "Mailing Country",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "MailingStreet__c",
                    "displayName": "Mailing Street",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Name__c",
                    "displayName": "Full Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Phone__c",
                    "displayName": "Business Phone",
                    "type": "STRING",
                    "businessType": "PHONE"
                },
                {
                    "name": "Salutation__c",
                    "displayName": "Salutation",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "SfdcOrganizationId__c",
                    "displayName": "SfdcOrganizationId",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "SystemModstamp__c",
                    "displayName": "System Modstamp",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "Title__c",
                    "displayName": "Title",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "category": "Profile",
            "name": "Contact_ServiceOrg__dll",
            "displayName": "Contact_ServiceOrg",
            "primaryKeys": [
                {
                    "name": "Id__c",
                    "displayName": "Contact ID",
                    "indexOrder": "1"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "KQ_Id__c",
                    "displayName": "Key Qualifier Individual Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__BirthDate__c",
                    "displayName": "Birth Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PersonName__c",
                    "displayName": "Person Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Salutation__c",
                    "displayName": "Salutation",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__TitleName__c",
                    "displayName": "Title",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Profile",
            "name": "ssot__Individual__dlm",
            "displayName": "Individual",
            "relationships": [
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "UnifiedLinkssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointAddress__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "Individual"
        },
        {
            "fields": [
                {
                    "name": "ssot__BirthDate__c",
                    "displayName": "Birth Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Individual Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PersonName__c",
                    "displayName": "Person Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Salutation__c",
                    "displayName": "Salutation",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__TitleName__c",
                    "displayName": "Title",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Profile",
            "name": "UnifiedssotIndividualIn01__dlm",
            "displayName": "Unified Individual IN01",
            "relationships": [
                {
                    "fromEntity": "UnifiedssotContactPointAddressIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotIndividualIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointEmailIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointPhoneIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Individual Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "UnifiedIndividual"
        },
        {
            "fields": [
                {
                    "name": "KQ_PartyId__c",
                    "displayName": "Key Qualifier Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "KQ_Id__c",
                    "displayName": "Key Qualifier Contact Point Address Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__AddressLine1__c",
                    "displayName": "Address Line 1",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CityId__c",
                    "displayName": "City",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CountryId__c",
                    "displayName": "Country",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Address Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "keyQualifier": "KQ_PartyId__c",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ssot__ContactPointAddress__dlm",
            "displayName": "Contact Point Address",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointAddress__dlm",
                    "toEntity": "UnifiedLinkssotContactPointAddressIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointAddress__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Address Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointAddress"
        },
        {
            "fields": [
                {
                    "name": "KQ_PartyId__c",
                    "displayName": "Key Qualifier Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "KQ_Id__c",
                    "displayName": "Key Qualifier Contact Point Email Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__EmailAddress__c",
                    "displayName": "Email Address",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Email Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "keyQualifier": "KQ_PartyId__c",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ssot__ContactPointEmail__dlm",
            "displayName": "Contact Point Email",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "UnifiedLinkssotContactPointEmailIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Email Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointEmail"
        },
        {
            "fields": [
                {
                    "name": "KQ_Id__c",
                    "displayName": "Key Qualifier Contact Point Phone Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__FormattedE164PhoneNumber__c",
                    "displayName": "Formatted E164 Phone Number",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Phone Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "keyQualifier": "KQ_PartyId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "KQ_PartyId__c",
                    "displayName": "Key Qualifier Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ssot__ContactPointPhone__dlm",
            "displayName": "Contact Point Phone",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "UnifiedLinkssotContactPointPhoneIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Phone Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointPhone"
        },
        {
            "fields": [
                {
                    "name": "KQ_SourceRecordId__c",
                    "displayName": "Key Qualifier Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Address Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_SourceRecordId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Contact Point Address Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedLinkssotContactPointAddressIn01__dlm",
            "displayName": "Unified Link Contact Point Address IN01",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointAddress__dlm",
                    "toEntity": "UnifiedLinkssotContactPointAddressIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotContactPointAddressIn01__dlm",
                    "toEntity": "UnifiedssotContactPointAddressIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Address Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointAddressIdentityLink"
        },
        {
            "fields": [
                {
                    "name": "KQ_SourceRecordId__c",
                    "displayName": "Key Qualifier Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Email Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_SourceRecordId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Contact Point Email Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedLinkssotContactPointEmailIn01__dlm",
            "displayName": "Unified Link Contact Point Email IN01",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "UnifiedLinkssotContactPointEmailIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotContactPointEmailIn01__dlm",
                    "toEntity": "UnifiedssotContactPointEmailIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Email Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointEmailIdentityLink"
        },
        {
            "fields": [
                {
                    "name": "KQ_SourceRecordId__c",
                    "displayName": "Key Qualifier Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Phone Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_SourceRecordId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Contact Point Phone Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedLinkssotContactPointPhoneIn01__dlm",
            "displayName": "Unified Link Contact Point Phone IN01",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "UnifiedLinkssotContactPointPhoneIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotContactPointPhoneIn01__dlm",
                    "toEntity": "UnifiedssotContactPointPhoneIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Phone Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointPhoneIdentityLink"
        },
        {
            "fields": [
                {
                    "name": "KQ_SourceRecordId__c",
                    "displayName": "Key Qualifier Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "MatchKeys__c",
                    "displayName": "Match Keys",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Individual Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_SourceRecordId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Individual Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedLinkssotIndividualIn01__dlm",
            "displayName": "Unified Link Individual IN01",
            "relationships": [
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "UnifiedLinkssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotIndividualIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ],
            "referenceModelEntityDeveloperName": "IndividualIdentityLink"
        },
        {
            "fields": [
                {
                    "name": "ssot__AddressLine1__c",
                    "displayName": "Address Line 1",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CityId__c",
                    "displayName": "City",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CountryId__c",
                    "displayName": "Country",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Address Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedssotContactPointAddressIn01__dlm",
            "displayName": "Unified Indv Contact Point Address IN01",
            "relationships": [
                {
                    "fromEntity": "UnifiedLinkssotContactPointAddressIn01__dlm",
                    "toEntity": "UnifiedssotContactPointAddressIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointAddressIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Address Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "UnifiedContactPointAddress"
        },
        {
            "fields": [
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__EmailAddress__c",
                    "displayName": "Email Address",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Email Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedssotContactPointEmailIn01__dlm",
            "displayName": "Unified Indv Contact Point Email IN01",
            "relationships": [
                {
                    "fromEntity": "UnifiedLinkssotContactPointEmailIn01__dlm",
                    "toEntity": "UnifiedssotContactPointEmailIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointEmailIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Email Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "UnifiedContactPointEmail"
        },
        {
            "fields": [
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__FormattedE164PhoneNumber__c",
                    "displayName": "Formatted E164 Phone Number",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Phone Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedssotContactPointPhoneIn01__dlm",
            "displayName": "Unified Indv Contact Point Phone IN01",
            "relationships": [
                {
                    "fromEntity": "UnifiedLinkssotContactPointPhoneIn01__dlm",
                    "toEntity": "UnifiedssotContactPointPhoneIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointPhoneIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Phone Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "UnifiedContactPointPhone"
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 06 Nov 2024 04:47:25 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=8RVvaTWNLU447lEE92QLtYpRDnARdlHdsweryKUuDGwLrhACnzieuiws/6n6B9HyFApgy+F99ZWnZuMMTVxjwMuAWfPXCZcUivSP7nnrE7/O3pXCY+Fe25aAYxQ1; Expires=Wed, 13 Nov 2024 04:47:25 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=8RVvaTWNLU447lEE92QLtYpRDnARdlHdsweryKUuDGwLrhACnzieuiws/6n6B9HyFApgy+F99ZWnZuMMTVxjwMuAWfPXCZcUivSP7nnrE7/O3pXCY+Fe25aAYxQ1; Expires=Wed, 13 Nov 2024 04:47:25 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"fa6a78a90f72d55d05853ef380b537f1"},{name:"set-cookie",value:"JSESSIONID=node01act8gilwbrxf1npv0oip9h0wh1561.node0; Path=/query; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"232"},{name:"server",value:"istio-envoy"},{name:"x-ratelimit-limit",value:"500, 500;w=1, 1000;w=86400"},{name:"x-ratelimit-remaining",value:"499"},{name:"x-ratelimit-reset",value:"1"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Metadata API/Metadata By Type",name:"Metadata By Type",folder:"Brobench/Data Cloud/Metadata API",description:`The response includes metadata about the data cloud object type supplied in the query parameters.

[https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_metadata_api.htm](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_metadata_api.htm)`,type:"data_cloud",method:"GET",path:"/api/v1/metadata?entityType=DataLakeObject",body:"",headers:[],query:[{name:"entityType",value:"DataLakeObject"}],headerInfos:[],queryInfos:[{name:"entityType",description:"Optional. The entity type for which metadata is requested. By default, this parameter includes all of the available types. Acceptable values: DataLakeObject, DataModelObject, and CalculatedInsight"}],responses:[{statusCode:200,name:"Metadata for DLOs",body:`{
    "metadata": [
        {
            "fields": [
                {
                    "name": "Birthdate__c",
                    "displayName": "Birthdate",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "cdp_sys_SourceVersion__c",
                    "displayName": "cdp_sys_SourceVersion",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "DataSource__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "DataSourceObject__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Email__c",
                    "displayName": "Email",
                    "type": "STRING",
                    "businessType": "EMAIL"
                },
                {
                    "name": "FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Id__c",
                    "displayName": "Contact ID",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "KQ_Id__c",
                    "displayName": "KQ_Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "MailingCity__c",
                    "displayName": "Mailing City",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "MailingCountry__c",
                    "displayName": "Mailing Country",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "MailingStreet__c",
                    "displayName": "Mailing Street",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Name__c",
                    "displayName": "Full Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Phone__c",
                    "displayName": "Business Phone",
                    "type": "STRING",
                    "businessType": "PHONE"
                },
                {
                    "name": "Salutation__c",
                    "displayName": "Salutation",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "SfdcOrganizationId__c",
                    "displayName": "SfdcOrganizationId",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "SystemModstamp__c",
                    "displayName": "System Modstamp",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "Title__c",
                    "displayName": "Title",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "category": "Profile",
            "name": "Contact_ServiceOrg__dll",
            "displayName": "Contact_ServiceOrg",
            "primaryKeys": [
                {
                    "name": "Id__c",
                    "displayName": "Contact ID",
                    "indexOrder": "1"
                }
            ]
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 06 Nov 2024 04:50:40 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=/A61CsGT4A1hKb09xEcvs47DuXVlGpp2zxysQr2nXtvTio7499SvtWL35HfGUPn59R/S3ldHblmfEkxOaSkx/Q1KUaAYEOmCLUt2pOtqgdJyHX+gaCWayVN5sY9O; Expires=Wed, 13 Nov 2024 04:50:40 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=/A61CsGT4A1hKb09xEcvs47DuXVlGpp2zxysQr2nXtvTio7499SvtWL35HfGUPn59R/S3ldHblmfEkxOaSkx/Q1KUaAYEOmCLUt2pOtqgdJyHX+gaCWayVN5sY9O; Expires=Wed, 13 Nov 2024 04:50:40 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"3cfb27999a5f7e2c44d92c8b930c3d03"},{name:"set-cookie",value:"JSESSIONID=node017q8x3d4t37bxggl9vlhqlm3e401.node0; Path=/query; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"462"},{name:"server",value:"istio-envoy"},{name:"x-ratelimit-limit",value:"500, 500;w=1, 1000;w=86400"},{name:"x-ratelimit-remaining",value:"499"},{name:"x-ratelimit-reset",value:"1"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Metadata API/Metadata By Entity",name:"Metadata By Entity",folder:"Brobench/Data Cloud/Metadata API",description:`The Metadata API response includes metadata about all entities, including Calculated Insights, Engagement, Profile, and other entities, as well as their relationships to other objects.

[https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_metadata_api.htm](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_metadata_api.htm)`,type:"data_cloud",method:"GET",path:"/api/v1/metadata?entityName=ssot__Individual__dlm",body:"",headers:[],query:[{name:"entityName",value:"ssot__Individual__dlm"}],headerInfos:[],queryInfos:[{name:"entityName",description:"Optional. The name of the requested metadata entity. By default, this parameter includes all of the available categories and an exhaustive list of entities. "}],responses:[{statusCode:200,name:"Metadata By Entity",body:`{
    "metadata": [
        {
            "fields": [
                {
                    "name": "KQ_Id__c",
                    "displayName": "Key Qualifier Individual Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__BirthDate__c",
                    "displayName": "Birth Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PersonName__c",
                    "displayName": "Person Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Salutation__c",
                    "displayName": "Salutation",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__TitleName__c",
                    "displayName": "Title",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Profile",
            "name": "ssot__Individual__dlm",
            "displayName": "Individual",
            "relationships": [
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "UnifiedLinkssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointAddress__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "Individual"
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 06 Nov 2024 06:58:25 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=xJIUiwEHel0I21AaOJ1q1NE19w01gW4zAeGjS5IIcbKTQumciTSV464f/JqcfOSpvsX0E8Otg0rzuMmHkNqXp0UuZdTm2CMkJjiGBjWJ9D7fVzlkAI0zAaVW31wJ; Expires=Wed, 13 Nov 2024 06:58:25 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=xJIUiwEHel0I21AaOJ1q1NE19w01gW4zAeGjS5IIcbKTQumciTSV464f/JqcfOSpvsX0E8Otg0rzuMmHkNqXp0UuZdTm2CMkJjiGBjWJ9D7fVzlkAI0zAaVW31wJ; Expires=Wed, 13 Nov 2024 06:58:25 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"e2bd91e150f7aa5ccf94539189b39b2e"},{name:"set-cookie",value:"JSESSIONID=node01i460hv5ethst1hjhezygu63vn1600.node0; Path=/query; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"121"},{name:"server",value:"istio-envoy"},{name:"x-ratelimit-limit",value:"500, 500;w=1, 1000;w=86400"},{name:"x-ratelimit-remaining",value:"499"},{name:"x-ratelimit-reset",value:"1"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Metadata API/Metadata By Category",name:"Metadata By Category",folder:"Brobench/Data Cloud/Metadata API",description:`The response includes metadata about all entities of the specified category type supplied in the query parameter.

[https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_metadata_api.htm](https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_metadata_api.htm)`,type:"data_cloud",method:"GET",path:"/api/v1/metadata?entityCategory=Profile",body:"",headers:[],query:[{name:"entityCategory",value:"Profile"}],headerInfos:[],queryInfos:[{name:"entityCategory",description:"Optional. The requested metadata entity category. By default, this parameter includes all of the available categories. It isn’t applicable for Calculated Insight entities. Acceptable values: Profile, Engagement, and Related"}],responses:[{statusCode:200,name:"Metadata For Profiles",body:`{
    "metadata": [
        {
            "fields": [
                {
                    "name": "Birthdate__c",
                    "displayName": "Birthdate",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "cdp_sys_SourceVersion__c",
                    "displayName": "cdp_sys_SourceVersion",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "DataSource__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "DataSourceObject__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Email__c",
                    "displayName": "Email",
                    "type": "STRING",
                    "businessType": "EMAIL"
                },
                {
                    "name": "FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Id__c",
                    "displayName": "Contact ID",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "KQ_Id__c",
                    "displayName": "KQ_Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "MailingCity__c",
                    "displayName": "Mailing City",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "MailingCountry__c",
                    "displayName": "Mailing Country",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "MailingStreet__c",
                    "displayName": "Mailing Street",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Name__c",
                    "displayName": "Full Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "Phone__c",
                    "displayName": "Business Phone",
                    "type": "STRING",
                    "businessType": "PHONE"
                },
                {
                    "name": "Salutation__c",
                    "displayName": "Salutation",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "SfdcOrganizationId__c",
                    "displayName": "SfdcOrganizationId",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "SystemModstamp__c",
                    "displayName": "System Modstamp",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "Title__c",
                    "displayName": "Title",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "category": "Profile",
            "name": "Contact_ServiceOrg__dll",
            "displayName": "Contact_ServiceOrg",
            "primaryKeys": [
                {
                    "name": "Id__c",
                    "displayName": "Contact ID",
                    "indexOrder": "1"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "KQ_Id__c",
                    "displayName": "Key Qualifier Individual Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__BirthDate__c",
                    "displayName": "Birth Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PersonName__c",
                    "displayName": "Person Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Salutation__c",
                    "displayName": "Salutation",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__TitleName__c",
                    "displayName": "Title",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Profile",
            "name": "ssot__Individual__dlm",
            "displayName": "Individual",
            "relationships": [
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "UnifiedLinkssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointAddress__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "Individual"
        },
        {
            "fields": [
                {
                    "name": "ssot__BirthDate__c",
                    "displayName": "Birth Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Individual Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__PersonName__c",
                    "displayName": "Person Name",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Salutation__c",
                    "displayName": "Salutation",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__TitleName__c",
                    "displayName": "Title",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Profile",
            "name": "UnifiedssotIndividualIn01__dlm",
            "displayName": "Unified Individual IN01",
            "relationships": [
                {
                    "fromEntity": "UnifiedssotContactPointAddressIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotIndividualIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointEmailIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointPhoneIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Individual Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "UnifiedIndividual"
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 06 Nov 2024 04:59:04 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=hveM2QyAJnol/l7m1nfMvBUqdvuG6Zfuu8w1+ElV3FH4tNBaGV2vDfbq/jEvRW5zFSlF4DyBAJACuqSMpC/t5AeG16X+HOHNihvcHI1fThwLYFx+XkC7DT/9qScg; Expires=Wed, 13 Nov 2024 04:59:03 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=hveM2QyAJnol/l7m1nfMvBUqdvuG6Zfuu8w1+ElV3FH4tNBaGV2vDfbq/jEvRW5zFSlF4DyBAJACuqSMpC/t5AeG16X+HOHNihvcHI1fThwLYFx+XkC7DT/9qScg; Expires=Wed, 13 Nov 2024 04:59:03 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"9298d559d85be6e3075984ff991a4b12"},{name:"set-cookie",value:"JSESSIONID=node01oio1uveypscz1gvhoiwltqfb1452.node0; Path=/query; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"536"},{name:"server",value:"istio-envoy"},{name:"x-ratelimit-limit",value:"500, 500;w=1, 1000;w=86400"},{name:"x-ratelimit-remaining",value:"499"},{name:"x-ratelimit-reset",value:"1"}]},{statusCode:200,name:"Metadata For Engagements",body:`{
    "metadata": []
}`,headers:[{name:"Date",value:"Wed, 06 Nov 2024 05:04:45 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=A5ujzCs4uiWNQBMyC16l/VCDv5ttPlxTSaM+ffuAwjsa15a+kfN8/MrtUSb4oODAjqtYLulYPRl9mHSRl5/0Wcl+42MIV34XZzzDOFtXSHt5oIZK1SZVOvJd+Wox; Expires=Wed, 13 Nov 2024 05:04:45 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=A5ujzCs4uiWNQBMyC16l/VCDv5ttPlxTSaM+ffuAwjsa15a+kfN8/MrtUSb4oODAjqtYLulYPRl9mHSRl5/0Wcl+42MIV34XZzzDOFtXSHt5oIZK1SZVOvJd+Wox; Expires=Wed, 13 Nov 2024 05:04:45 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"d74cad5eadf9227cb9420189bf41c2a1"},{name:"set-cookie",value:"JSESSIONID=node01v3ab5y0abl7sepbgqgq1aicm1453.node0; Path=/query; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"74"},{name:"server",value:"istio-envoy"},{name:"x-ratelimit-limit",value:"500, 500;w=1, 1000;w=86400"},{name:"x-ratelimit-remaining",value:"499"},{name:"x-ratelimit-reset",value:"1"}]},{statusCode:200,name:"Metadata For Related Objects",body:`{
    "metadata": [
        {
            "fields": [
                {
                    "name": "KQ_PartyId__c",
                    "displayName": "Key Qualifier Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "KQ_Id__c",
                    "displayName": "Key Qualifier Contact Point Address Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__AddressLine1__c",
                    "displayName": "Address Line 1",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CityId__c",
                    "displayName": "City",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CountryId__c",
                    "displayName": "Country",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Address Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "keyQualifier": "KQ_PartyId__c",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ssot__ContactPointAddress__dlm",
            "displayName": "Contact Point Address",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointAddress__dlm",
                    "toEntity": "UnifiedLinkssotContactPointAddressIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointAddress__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Address Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointAddress"
        },
        {
            "fields": [
                {
                    "name": "KQ_PartyId__c",
                    "displayName": "Key Qualifier Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "KQ_Id__c",
                    "displayName": "Key Qualifier Contact Point Email Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__EmailAddress__c",
                    "displayName": "Email Address",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Email Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "keyQualifier": "KQ_PartyId__c",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ssot__ContactPointEmail__dlm",
            "displayName": "Contact Point Email",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "UnifiedLinkssotContactPointEmailIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Email Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointEmail"
        },
        {
            "fields": [
                {
                    "name": "KQ_Id__c",
                    "displayName": "Key Qualifier Contact Point Phone Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__FormattedE164PhoneNumber__c",
                    "displayName": "Formatted E164 Phone Number",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Phone Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_Id__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "keyQualifier": "KQ_PartyId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "KQ_PartyId__c",
                    "displayName": "Key Qualifier Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ssot__ContactPointPhone__dlm",
            "displayName": "Contact Point Phone",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "UnifiedLinkssotContactPointPhoneIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Phone Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointPhone"
        },
        {
            "fields": [
                {
                    "name": "KQ_SourceRecordId__c",
                    "displayName": "Key Qualifier Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Address Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_SourceRecordId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Contact Point Address Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedLinkssotContactPointAddressIn01__dlm",
            "displayName": "Unified Link Contact Point Address IN01",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointAddress__dlm",
                    "toEntity": "UnifiedLinkssotContactPointAddressIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotContactPointAddressIn01__dlm",
                    "toEntity": "UnifiedssotContactPointAddressIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Address Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointAddressIdentityLink"
        },
        {
            "fields": [
                {
                    "name": "KQ_SourceRecordId__c",
                    "displayName": "Key Qualifier Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Email Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_SourceRecordId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Contact Point Email Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedLinkssotContactPointEmailIn01__dlm",
            "displayName": "Unified Link Contact Point Email IN01",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "UnifiedLinkssotContactPointEmailIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotContactPointEmailIn01__dlm",
                    "toEntity": "UnifiedssotContactPointEmailIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Email Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointEmailIdentityLink"
        },
        {
            "fields": [
                {
                    "name": "KQ_SourceRecordId__c",
                    "displayName": "Key Qualifier Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Phone Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_SourceRecordId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Contact Point Phone Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedLinkssotContactPointPhoneIn01__dlm",
            "displayName": "Unified Link Contact Point Phone IN01",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "UnifiedLinkssotContactPointPhoneIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotContactPointPhoneIn01__dlm",
                    "toEntity": "UnifiedssotContactPointPhoneIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Phone Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ],
            "referenceModelEntityDeveloperName": "ContactPointPhoneIdentityLink"
        },
        {
            "fields": [
                {
                    "name": "KQ_SourceRecordId__c",
                    "displayName": "Key Qualifier Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "MatchKeys__c",
                    "displayName": "Match Keys",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Individual Id",
                    "type": "STRING",
                    "keyQualifier": "KQ_SourceRecordId__c",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Individual Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedLinkssotIndividualIn01__dlm",
            "displayName": "Unified Link Individual IN01",
            "relationships": [
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "UnifiedLinkssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "UnifiedLinkssotIndividualIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ],
            "referenceModelEntityDeveloperName": "IndividualIdentityLink"
        },
        {
            "fields": [
                {
                    "name": "ssot__AddressLine1__c",
                    "displayName": "Address Line 1",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CityId__c",
                    "displayName": "City",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CountryId__c",
                    "displayName": "Country",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Address Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedssotContactPointAddressIn01__dlm",
            "displayName": "Unified Indv Contact Point Address IN01",
            "relationships": [
                {
                    "fromEntity": "UnifiedLinkssotContactPointAddressIn01__dlm",
                    "toEntity": "UnifiedssotContactPointAddressIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointAddressIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Address Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "UnifiedContactPointAddress"
        },
        {
            "fields": [
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__EmailAddress__c",
                    "displayName": "Email Address",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Email Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedssotContactPointEmailIn01__dlm",
            "displayName": "Unified Indv Contact Point Email IN01",
            "relationships": [
                {
                    "fromEntity": "UnifiedLinkssotContactPointEmailIn01__dlm",
                    "toEntity": "UnifiedssotContactPointEmailIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointEmailIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Email Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "UnifiedContactPointEmail"
        },
        {
            "fields": [
                {
                    "name": "ssot__CreatedDate__c",
                    "displayName": "Created Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__FormattedE164PhoneNumber__c",
                    "displayName": "Formatted E164 Phone Number",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Phone Id",
                    "type": "STRING",
                    "businessType": "TEXT"
                },
                {
                    "name": "ssot__LastModifiedDate__c",
                    "displayName": "Last Modified Date",
                    "type": "DATE_TIME",
                    "businessType": "DATE_TIME"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING",
                    "businessType": "TEXT"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedssotContactPointPhoneIn01__dlm",
            "displayName": "Unified Indv Contact Point Phone IN01",
            "relationships": [
                {
                    "fromEntity": "UnifiedLinkssotContactPointPhoneIn01__dlm",
                    "toEntity": "UnifiedssotContactPointPhoneIn01__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedssotContactPointPhoneIn01__dlm",
                    "toEntity": "UnifiedssotIndividualIn01__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Unified Contact Point Phone Id",
                    "indexOrder": "1"
                }
            ],
            "referenceModelEntityDeveloperName": "UnifiedContactPointPhone"
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 06 Nov 2024 05:13:39 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=wsjrKZjvTebNgUkfS0u8BnNM40ggkh08FZB865a/Gdigm/RVJVAdgQeK4gHy++k/DTOyAH/op4Ga7Om+GknMwQ4Yt+nX+nuxeGmt5h3XVmSsxP28xbsO6Iu8BOiJ; Expires=Wed, 13 Nov 2024 05:13:39 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=wsjrKZjvTebNgUkfS0u8BnNM40ggkh08FZB865a/Gdigm/RVJVAdgQeK4gHy++k/DTOyAH/op4Ga7Om+GknMwQ4Yt+nX+nuxeGmt5h3XVmSsxP28xbsO6Iu8BOiJ; Expires=Wed, 13 Nov 2024 05:13:39 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"1ca083c1823d5b59cde6614e3bffceb0"},{name:"set-cookie",value:"JSESSIONID=node01vsc3cnz3spkg2va9n99xl4ud1468.node0; Path=/query; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"143"},{name:"server",value:"istio-envoy"},{name:"x-ratelimit-limit",value:"500, 500;w=1, 1000;w=86400"},{name:"x-ratelimit-remaining",value:"499"},{name:"x-ratelimit-reset",value:"1"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Calculated Insights API/Query Calculated Insights",name:"Query Calculated Insights",folder:"Brobench/Data Cloud/Calculated Insights API",description:`Returns the list of data model objects, their fields, and category.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_profile_meta.htm`,type:"data_cloud",method:"GET",path:"/api/v1/insight/calculated-insights/:ci_name",bodyType:"raw",body:"",headers:[],query:[{name:"batchSize",value:"5"},{name:"dimensions",value:"PurchaseDay__c,CustomerId__c"},{name:"measures",value:"TotalOrders__c"},{name:"filters",value:"[CustomerId__c=A003]"}],headerInfos:[],queryInfos:[{name:"batchSize"},{name:"dimensions"},{name:"measures"},{name:"filters"}],responses:[{statusCode:200,name:"Query Calculated Insights",body:`{
    "data": [
        {
            "CustomerId__c": "A003",
            "PurchaseDay__c": "10",
            "TotalOrders__c": 1
        },
        {
            "CustomerId__c": "A003",
            "PurchaseDay__c": "28",
            "TotalOrders__c": 1
        },
        {
            "CustomerId__c": "A003",
            "PurchaseDay__c": "5",
            "TotalOrders__c": 1
        }
    ],
    "done": true
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:56:27 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=l0wFK7mYakrtyza2X+DcGmWd8QEGjoy50yEs21+Tk2dG4bW7UyuTslqVklp+G5lscqnrzK0KKUKvZKjtbeIiFx8A3v6her7LgKTyg7l0aHaqvZYX1/qWXvTBEZPt; Expires=Wed, 15 Sep 2021 14:56:26 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=l0wFK7mYakrtyza2X+DcGmWd8QEGjoy50yEs21+Tk2dG4bW7UyuTslqVklp+G5lscqnrzK0KKUKvZKjtbeIiFx8A3v6her7LgKTyg7l0aHaqvZYX1/qWXvTBEZPt; Expires=Wed, 15 Sep 2021 14:56:26 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"66cb06ff6fe0ae95b6276e71fc0c33f0"},{name:"set-cookie",value:"JSESSIONID=node0qip8xsiyu01nwhs6sne3hty8389.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"923"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Calculated Insights API/Metadata - Individual Calculated Insight",name:"Metadata - Individual Calculated Insight",folder:"Brobench/Data Cloud/Calculated Insights API",description:`The metadata includes the dimension and measure that are part of the calculated insight.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_insights_meta_ci_name.htm`,type:"data_cloud",method:"GET",path:"/api/v1/insight/metadata/:ci_name",bodyType:"raw",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Metadata - Individual Calculated Insight",body:`{
    "metadata": [
        {
            "name": "PurchaseByDate__cio",
            "displayName": "PurchaseByDate",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "NUMBER"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate__cio"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate__cio"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:57:19 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=iAhetweg4iU4XMr1BytG6ny0Jg7URq6WK+Vni84gU5rMAMPfOWZtOEGghXo5fql2u2q4B20UqKfYqMlfo7VEXWP+YIH76dXJZFjOTrnV6QrBCt834MaLQRnrc2Mi; Expires=Wed, 15 Sep 2021 14:57:19 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=iAhetweg4iU4XMr1BytG6ny0Jg7URq6WK+Vni84gU5rMAMPfOWZtOEGghXo5fql2u2q4B20UqKfYqMlfo7VEXWP+YIH76dXJZFjOTrnV6QrBCt834MaLQRnrc2Mi; Expires=Wed, 15 Sep 2021 14:57:19 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"a1fcc4bf9d8f097e821fda19f08fc2d1"},{name:"set-cookie",value:"JSESSIONID=node01a9j5wcsn7pko1mr31k930h7i7394.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"37"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Calculated Insights API/Metadata - All Calculated Insights",name:"Metadata - All Calculated Insights",folder:"Brobench/Data Cloud/Calculated Insights API",description:`Get Salesforce CDP Insight metadata, including Calculated Insight objects, their dimensions and measures.

https://developer.salesforce.com/docs/atlas.en-us.chatterapi.meta/chatterapi/connect_resources_insight_metadata.htm`,type:"data_cloud",method:"GET",path:"/api/v1/insight/metadata",bodyType:"raw",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Metadata - All Calculated Insights",body:`{
    "metadata": [
        {
            "name": "PurchaseByDate3__cio",
            "displayName": "PurchaseByDate3",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate3__cio"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate3__cio"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "PurchaseByDate3__cio_DAY",
            "displayName": "PurchaseByDate3",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate3__cio_DAY"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate3__cio_DAY"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "PurchaseByDate3__cio_MONTH",
            "displayName": "PurchaseByDate3",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate3__cio_MONTH"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate3__cio_MONTH"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "PurchaseByDate3__cio_QUARTER",
            "displayName": "PurchaseByDate3",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate3__cio_QUARTER"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate3__cio_QUARTER"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "PurchaseByDate3__cio_YEAR",
            "displayName": "PurchaseByDate3",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate3__cio_YEAR"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate3__cio_YEAR"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "Total_Purchases__cio",
            "displayName": "Total Purchases",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                }
            ],
            "measures": [
                {
                    "name": "TotalPurchases__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "Total_Purchases__cio"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "Total_Purchases__cio"
                }
            ],
            "partitionBy": "CustomerId__c"
        },
        {
            "name": "PurchaseByDate__cio",
            "displayName": "PurchaseByDate",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "NUMBER"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate__cio"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate__cio"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "PurchaseByDate2__cio",
            "displayName": "PurchaseByDate2",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate2__cio"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate2__cio"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "PurchaseByDate2__cio_DAY",
            "displayName": "PurchaseByDate2",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate2__cio_DAY"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate2__cio_DAY"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "PurchaseByDate2__cio_MONTH",
            "displayName": "PurchaseByDate2",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate2__cio_MONTH"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate2__cio_MONTH"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "PurchaseByDate2__cio_QUARTER",
            "displayName": "PurchaseByDate2",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate2__cio_QUARTER"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate2__cio_QUARTER"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        },
        {
            "name": "PurchaseByDate2__cio_YEAR",
            "displayName": "PurchaseByDate2",
            "dimensions": [
                {
                    "name": "CustomerId__c",
                    "displayName": "",
                    "type": "STRING"
                },
                {
                    "name": "PurchaseDay__c",
                    "displayName": "",
                    "type": "DATE_TIME"
                }
            ],
            "measures": [
                {
                    "name": "TotalOrders__c",
                    "displayName": "",
                    "type": "NUMBER",
                    "rollupable": true
                }
            ],
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "PurchaseByDate2__cio_YEAR"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "PurchaseByDate2__cio_YEAR"
                }
            ],
            "partitionBy": "PurchaseDay__c"
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:59:10 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=W4w64W1ZOdYNdzCL/g8plZ99szpfvDRsibDhfs5sc21ZxVw6S8Vy22rp7tBtR+alFJf8CQ+9EkrDDchXFYsHZ7miGABmmZN70f42+Ox5yofRNh6L8GckT72il7bZ; Expires=Wed, 15 Sep 2021 14:59:10 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=W4w64W1ZOdYNdzCL/g8plZ99szpfvDRsibDhfs5sc21ZxVw6S8Vy22rp7tBtR+alFJf8CQ+9EkrDDchXFYsHZ7miGABmmZN70f42+Ox5yofRNh6L8GckT72il7bZ; Expires=Wed, 15 Sep 2021 14:59:10 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"ab4fcf5c3a6970d3217edda860dfab34"},{name:"set-cookie",value:"JSESSIONID=node010pc9y49ri8q318ph39yncixgy398.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"106"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Query API V1/Query",name:"Query",folder:"Brobench/Data Cloud/Query API V1",description:`Use this API to query the Customer 360 Audiences data lake across data model, lake, unified, and linked objects.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query.htm`,type:"data_cloud",method:"POST",path:"/api/v1/query",bodyType:"raw",body:`{
    "sql" : "SELECT ssot__DataSourceId__c, ssot__DataSourceObjectId__c, ssot__InternalOrganizationId__c, ssot__PurchaseOrderDate__c, ssot__Id__c, ssot__SoldToCustomerId__c FROM ssot__SalesOrder__dlm WHERE ssot__SoldToCustomerId__c = 'A001' "
}`,headers:[{name:"Content-Type",value:"application/json"}],query:[],headerInfos:[{name:"Content-Type"}],queryInfos:[],responses:[{statusCode:200,name:"Query",body:`{
    "data": [
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_018",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-26T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_002",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_014",
            "ssot__SoldToCustomerId__c": "A001"
        }
    ],
    "startTime": "2021-09-08T14:59:39.120024Z",
    "endTime": "2021-09-08T14:59:41.71155Z",
    "rowCount": 3,
    "queryId": "08be2ddc-4a1d-4a4b-8fa8-efce1acf1b83",
    "done": true,
    "metadata": {
        "ssot__PurchaseOrderDate__c": {
            "type": "TIMESTAMP",
            "placeInOrder": 3,
            "typeCode": 93
        },
        "ssot__InternalOrganizationId__c": {
            "type": "VARCHAR",
            "placeInOrder": 2,
            "typeCode": 12
        },
        "ssot__SoldToCustomerId__c": {
            "type": "VARCHAR",
            "placeInOrder": 5,
            "typeCode": 12
        },
        "ssot__DataSourceObjectId__c": {
            "type": "VARCHAR",
            "placeInOrder": 1,
            "typeCode": 12
        },
        "ssot__Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 4,
            "typeCode": 12
        },
        "ssot__DataSourceId__c": {
            "type": "VARCHAR",
            "placeInOrder": 0,
            "typeCode": 12
        }
    }
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:59:41 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"b45dd9fb4cdea33b4d058ec22f5a4027"},{name:"set-cookie",value:"JSESSIONID=node0xot6nlqxn7sg1v7bigttjamku376.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"2636"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Query API V1/Query With Limits",name:"Query With Limits",folder:"Brobench/Data Cloud/Query API V1",description:`Use this API to query the Customer 360 Audiences data lake across data model, lake, unified, and linked objects.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query.htm`,type:"data_cloud",method:"POST",path:"/api/v1/query?limit=5",bodyType:"raw",body:`{
    "sql" : "SELECT * FROM Contact_ServiceOrg__dll"
}`,headers:[{name:"Content-Type",value:"application/json"}],query:[{name:"limit",value:"5"}],headerInfos:[{name:"Content-Type"}],queryInfos:[{name:"limit"}],responses:[{statusCode:200,name:"Query With Limits",body:`{
    "data": [
        {
            "Birthdate__c": "1959-02-22T00:00:00.000+00:00",
            "CreatedDate__c": "2024-01-25T11:43:09.000+00:00",
            "DataSourceObject__c": "Contact",
            "DataSource__c": "Salesforce_ServiceOrg",
            "Email__c": "jwu@example.com",
            "FirstName__c": "James",
            "Id__c": "0034J00001GHMgKQAX",
            "LastModifiedDate__c": "2024-01-25T11:43:09.000+00:00",
            "LastName__c": "Wu",
            "MailingCity__c": "San Francisco",
            "MailingCountry__c": "US",
            "MailingStreet__c": "1 Market St",
            "Name__c": "James Wu",
            "Phone__c": "(274) 555-0197",
            "Salutation__c": "Mr.",
            "SfdcOrganizationId__c": "00D4J000000OUJmUAO",
            "SystemModstamp__c": "2024-01-25T11:43:09.000+00:00",
            "Title__c": "VP of Sales"
        },
        {
            "Birthdate__c": "1957-11-13T00:00:00.000+00:00",
            "CreatedDate__c": "2024-01-25T11:43:09.000+00:00",
            "DataSourceObject__c": "Contact",
            "DataSource__c": "Salesforce_ServiceOrg",
            "Email__c": "rjanzen@example.com",
            "FirstName__c": "Robert",
            "Id__c": "0034J00001GHMgLQAX",
            "LastModifiedDate__c": "2024-01-25T11:43:09.000+00:00",
            "LastName__c": "Janzen",
            "MailingCity__c": "",
            "MailingCountry__c": "",
            "MailingStreet__c": "",
            "Name__c": "Robert Janzen",
            "Phone__c": "(858) 555-0100",
            "Salutation__c": "Mr.",
            "SfdcOrganizationId__c": "00D4J000000OUJmUAO",
            "SystemModstamp__c": "2024-01-25T11:43:09.000+00:00",
            "Title__c": ""
        },
        {
            "Birthdate__c": "1984-08-22T00:00:00.000+00:00",
            "CreatedDate__c": "2024-01-25T11:43:09.000+00:00",
            "DataSourceObject__c": "Contact",
            "DataSource__c": "Salesforce_ServiceOrg",
            "Email__c": "apearson_updated@example.com",
            "FirstName__c": "Aiden",
            "Id__c": "0034J00001GHMgSQAX",
            "LastModifiedDate__c": "2024-07-05T09:13:57.000+00:00",
            "LastName__c": "Pearson",
            "MailingCity__c": "San Francisco",
            "MailingCountry__c": "USA",
            "MailingStreet__c": "50 Fremont Street",
            "Name__c": "Aiden Pearson",
            "Phone__c": "(415) 555-7722",
            "Salutation__c": "Mr.",
            "SfdcOrganizationId__c": "00D4J000000OUJmUAO",
            "SystemModstamp__c": "2024-07-05T09:13:57.000+00:00",
            "Title__c": "Owner"
        },
        {
            "Birthdate__c": "1962-10-29T00:00:00.000+00:00",
            "CreatedDate__c": "2024-01-25T11:43:09.000+00:00",
            "DataSourceObject__c": "Contact",
            "DataSource__c": "Salesforce_ServiceOrg",
            "Email__c": "jbergman@example.com",
            "FirstName__c": "Janice",
            "Id__c": "0034J00001GHMgeQAH",
            "LastModifiedDate__c": "2024-01-25T11:43:09.000+00:00",
            "LastName__c": "Bergman",
            "MailingCity__c": "New York",
            "MailingCountry__c": "USA",
            "MailingStreet__c": "310 Henry St",
            "Name__c": "Janice Bergman",
            "Phone__c": "(810) 555-9875",
            "Salutation__c": "Ms.",
            "SfdcOrganizationId__c": "00D4J000000OUJmUAO",
            "SystemModstamp__c": "2024-01-25T11:43:09.000+00:00",
            "Title__c": "VP, Purchasing"
        },
        {
            "Birthdate__c": "1973-01-09T00:00:00.000+00:00",
            "CreatedDate__c": "2024-01-25T11:43:09.000+00:00",
            "DataSourceObject__c": "Contact",
            "DataSource__c": "Salesforce_ServiceOrg",
            "Email__c": "tdavis@example.com",
            "FirstName__c": "Tom",
            "Id__c": "0034J00001GHMgrQAH",
            "LastModifiedDate__c": "2024-01-25T11:43:09.000+00:00",
            "LastName__c": "Davis",
            "MailingCity__c": "Santa Cruz",
            "MailingCountry__c": "USA",
            "MailingStreet__c": "309 8th Ave",
            "Name__c": "Tom Davis",
            "Phone__c": "(643) 555-5886",
            "Salutation__c": "Mr.",
            "SfdcOrganizationId__c": "00D4J000000OUJmUAO",
            "SystemModstamp__c": "2024-01-25T11:43:09.000+00:00",
            "Title__c": "Development Director"
        }
    ],
    "startTime": "2024-11-06T07:17:13.45418Z",
    "endTime": "2024-11-06T07:17:14.328783Z",
    "rowCount": 5,
    "queryId": "20241106_071621_02175_g48yi",
    "done": false,
    "metadata": {
        "Name__c": {
            "type": "VARCHAR",
            "placeInOrder": 13,
            "typeCode": 12
        },
        "Birthdate__c": {
            "type": "TIMESTAMP WITH TIME ZONE",
            "placeInOrder": 0,
            "typeCode": 2014
        },
        "SystemModstamp__c": {
            "type": "TIMESTAMP WITH TIME ZONE",
            "placeInOrder": 17,
            "typeCode": 2014
        },
        "KQ_Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 7,
            "typeCode": 12
        },
        "Title__c": {
            "type": "VARCHAR",
            "placeInOrder": 18,
            "typeCode": 12
        },
        "cdp_sys_SourceVersion__c": {
            "type": "VARCHAR",
            "placeInOrder": 19,
            "typeCode": 12
        },
        "MailingCity__c": {
            "type": "VARCHAR",
            "placeInOrder": 10,
            "typeCode": 12
        },
        "Salutation__c": {
            "type": "VARCHAR",
            "placeInOrder": 15,
            "typeCode": 12
        },
        "CreatedDate__c": {
            "type": "TIMESTAMP WITH TIME ZONE",
            "placeInOrder": 1,
            "typeCode": 2014
        },
        "SfdcOrganizationId__c": {
            "type": "VARCHAR",
            "placeInOrder": 16,
            "typeCode": 12
        },
        "DataSource__c": {
            "type": "VARCHAR",
            "placeInOrder": 3,
            "typeCode": 12
        },
        "MailingCountry__c": {
            "type": "VARCHAR",
            "placeInOrder": 11,
            "typeCode": 12
        },
        "LastName__c": {
            "type": "VARCHAR",
            "placeInOrder": 9,
            "typeCode": 12
        },
        "MailingStreet__c": {
            "type": "VARCHAR",
            "placeInOrder": 12,
            "typeCode": 12
        },
        "Phone__c": {
            "type": "VARCHAR",
            "placeInOrder": 14,
            "typeCode": 12
        },
        "DataSourceObject__c": {
            "type": "VARCHAR",
            "placeInOrder": 2,
            "typeCode": 12
        },
        "Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 6,
            "typeCode": 12
        },
        "LastModifiedDate__c": {
            "type": "TIMESTAMP WITH TIME ZONE",
            "placeInOrder": 8,
            "typeCode": 2014
        },
        "FirstName__c": {
            "type": "VARCHAR",
            "placeInOrder": 5,
            "typeCode": 12
        },
        "Email__c": {
            "type": "VARCHAR",
            "placeInOrder": 4,
            "typeCode": 12
        }
    }
}`,headers:[{name:"Date",value:"Wed, 06 Nov 2024 07:17:14 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=dXhf+k1x72ChkleaQpw2ncOF6PDqlCgc3/jLXVcwm5cnw9Lkwd544O1x51n6NVGliwHG1W0GMTYEX5wQWUa/gvyWQ/dvuPCoUlaN5fkXRkUEs6gwDStYW7jFCBCF; Expires=Wed, 13 Nov 2024 07:17:13 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=dXhf+k1x72ChkleaQpw2ncOF6PDqlCgc3/jLXVcwm5cnw9Lkwd544O1x51n6NVGliwHG1W0GMTYEX5wQWUa/gvyWQ/dvuPCoUlaN5fkXRkUEs6gwDStYW7jFCBCF; Expires=Wed, 13 Nov 2024 07:17:13 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"e1566f4f644c1dc4a86f81ca53af08cc"},{name:"set-cookie",value:"JSESSIONID=node01jxtuw7gtmqu0ta8mgqg8ziw5556.node0; Path=/query; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"895"},{name:"server",value:"istio-envoy"},{name:"x-ratelimit-limit",value:"500, 500;w=1, 1000;w=86400"},{name:"x-ratelimit-remaining",value:"499"},{name:"x-ratelimit-reset",value:"1"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Query API V2/Query",name:"Query",folder:"Brobench/Data Cloud/Query API V2",description:`Use this API to query the Customer 360 Audiences data lake across data model, lake, unified, and linked objects.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query.htm`,type:"data_cloud",method:"POST",path:"/api/v2/query",bodyType:"raw",body:`{
    "sql" : "SELECT ssot__DataSourceId__c, ssot__DataSourceObjectId__c, ssot__InternalOrganizationId__c, ssot__PurchaseOrderDate__c, ssot__Id__c, ssot__SoldToCustomerId__c FROM ssot__SalesOrder__dlm WHERE ssot__SoldToCustomerId__c = 'A001' "
}`,headers:[{name:"Content-Type",value:"application/json"}],query:[],headerInfos:[{name:"Content-Type"}],queryInfos:[],responses:[{statusCode:200,name:"Query",body:`{
    "data": [
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_018",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-26T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_002",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_014",
            "ssot__SoldToCustomerId__c": "A001"
        }
    ],
    "startTime": "2021-09-08T14:59:39.120024Z",
    "endTime": "2021-09-08T14:59:41.71155Z",
    "rowCount": 3,
    "queryId": "08be2ddc-4a1d-4a4b-8fa8-efce1acf1b83",
    "done": true,
    "metadata": {
        "ssot__PurchaseOrderDate__c": {
            "type": "TIMESTAMP",
            "placeInOrder": 3,
            "typeCode": 93
        },
        "ssot__InternalOrganizationId__c": {
            "type": "VARCHAR",
            "placeInOrder": 2,
            "typeCode": 12
        },
        "ssot__SoldToCustomerId__c": {
            "type": "VARCHAR",
            "placeInOrder": 5,
            "typeCode": 12
        },
        "ssot__DataSourceObjectId__c": {
            "type": "VARCHAR",
            "placeInOrder": 1,
            "typeCode": 12
        },
        "ssot__Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 4,
            "typeCode": 12
        },
        "ssot__DataSourceId__c": {
            "type": "VARCHAR",
            "placeInOrder": 0,
            "typeCode": 12
        }
    }
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:59:41 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"b45dd9fb4cdea33b4d058ec22f5a4027"},{name:"set-cookie",value:"JSESSIONID=node0xot6nlqxn7sg1v7bigttjamku376.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"2636"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Query API V2/Query Next Batch",name:"Query Next Batch",folder:"Brobench/Data Cloud/Query API V2",description:`Use this API to query the Customer 360 Audiences data lake across data model, lake, unified, and linked objects.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query.htm`,type:"data_cloud",method:"GET",path:"/api/v2/query/:nextBatchId",bodyType:"raw",body:"",headers:[{name:"Content-Type",value:"application/json"}],query:[],headerInfos:[{name:"Content-Type"}],queryInfos:[],responses:[{statusCode:200,name:"Query",body:`{
    "data": [
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_018",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-26T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_002",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_014",
            "ssot__SoldToCustomerId__c": "A001"
        }
    ],
    "startTime": "2021-09-08T14:59:39.120024Z",
    "endTime": "2021-09-08T14:59:41.71155Z",
    "rowCount": 3,
    "queryId": "08be2ddc-4a1d-4a4b-8fa8-efce1acf1b83",
    "done": true,
    "metadata": {
        "ssot__PurchaseOrderDate__c": {
            "type": "TIMESTAMP",
            "placeInOrder": 3,
            "typeCode": 93
        },
        "ssot__InternalOrganizationId__c": {
            "type": "VARCHAR",
            "placeInOrder": 2,
            "typeCode": 12
        },
        "ssot__SoldToCustomerId__c": {
            "type": "VARCHAR",
            "placeInOrder": 5,
            "typeCode": 12
        },
        "ssot__DataSourceObjectId__c": {
            "type": "VARCHAR",
            "placeInOrder": 1,
            "typeCode": 12
        },
        "ssot__Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 4,
            "typeCode": 12
        },
        "ssot__DataSourceId__c": {
            "type": "VARCHAR",
            "placeInOrder": 0,
            "typeCode": 12
        }
    }
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:59:41 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"b45dd9fb4cdea33b4d058ec22f5a4027"},{name:"set-cookie",value:"JSESSIONID=node0xot6nlqxn7sg1v7bigttjamku376.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"2636"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Data Graph API/Metadata of All Data Graphs",name:"Metadata of All Data Graphs",folder:"Brobench/Data Cloud/Data Graph API",description:`Use this API to query the Customer 360 Audiences data lake across data model, lake, unified, and linked objects.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query.htm`,type:"data_cloud",method:"GET",path:"/api/v1/dataGraph/metadata",bodyType:"raw",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Query",body:`{
    "data": [
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_018",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-26T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_002",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_014",
            "ssot__SoldToCustomerId__c": "A001"
        }
    ],
    "startTime": "2021-09-08T14:59:39.120024Z",
    "endTime": "2021-09-08T14:59:41.71155Z",
    "rowCount": 3,
    "queryId": "08be2ddc-4a1d-4a4b-8fa8-efce1acf1b83",
    "done": true,
    "metadata": {
        "ssot__PurchaseOrderDate__c": {
            "type": "TIMESTAMP",
            "placeInOrder": 3,
            "typeCode": 93
        },
        "ssot__InternalOrganizationId__c": {
            "type": "VARCHAR",
            "placeInOrder": 2,
            "typeCode": 12
        },
        "ssot__SoldToCustomerId__c": {
            "type": "VARCHAR",
            "placeInOrder": 5,
            "typeCode": 12
        },
        "ssot__DataSourceObjectId__c": {
            "type": "VARCHAR",
            "placeInOrder": 1,
            "typeCode": 12
        },
        "ssot__Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 4,
            "typeCode": 12
        },
        "ssot__DataSourceId__c": {
            "type": "VARCHAR",
            "placeInOrder": 0,
            "typeCode": 12
        }
    }
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:59:41 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"b45dd9fb4cdea33b4d058ec22f5a4027"},{name:"set-cookie",value:"JSESSIONID=node0xot6nlqxn7sg1v7bigttjamku376.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"2636"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Data Graph API/Metadata of a Data Graph",name:"Metadata of a Data Graph",folder:"Brobench/Data Cloud/Data Graph API",description:`Use this API to query the Customer 360 Audiences data lake across data model, lake, unified, and linked objects.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query.htm`,type:"data_cloud",method:"GET",path:"/api/v1/dataGraph/metadata?entityName=",bodyType:"raw",body:"",headers:[],query:[{name:"entityName",value:""}],headerInfos:[],queryInfos:[{name:"entityName",description:"API name of the data graph for which metadata is being requested. When a data graph is created, the API name is the value set in the DataGraphApiName field."}],responses:[{statusCode:200,name:"Query",body:`{
    "data": [
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_018",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-26T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_002",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_014",
            "ssot__SoldToCustomerId__c": "A001"
        }
    ],
    "startTime": "2021-09-08T14:59:39.120024Z",
    "endTime": "2021-09-08T14:59:41.71155Z",
    "rowCount": 3,
    "queryId": "08be2ddc-4a1d-4a4b-8fa8-efce1acf1b83",
    "done": true,
    "metadata": {
        "ssot__PurchaseOrderDate__c": {
            "type": "TIMESTAMP",
            "placeInOrder": 3,
            "typeCode": 93
        },
        "ssot__InternalOrganizationId__c": {
            "type": "VARCHAR",
            "placeInOrder": 2,
            "typeCode": 12
        },
        "ssot__SoldToCustomerId__c": {
            "type": "VARCHAR",
            "placeInOrder": 5,
            "typeCode": 12
        },
        "ssot__DataSourceObjectId__c": {
            "type": "VARCHAR",
            "placeInOrder": 1,
            "typeCode": 12
        },
        "ssot__Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 4,
            "typeCode": 12
        },
        "ssot__DataSourceId__c": {
            "type": "VARCHAR",
            "placeInOrder": 0,
            "typeCode": 12
        }
    }
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:59:41 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"b45dd9fb4cdea33b4d058ec22f5a4027"},{name:"set-cookie",value:"JSESSIONID=node0xot6nlqxn7sg1v7bigttjamku376.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"2636"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Data Graph API/Query Data Graph Data",name:"Query Data Graph Data",folder:"Brobench/Data Cloud/Data Graph API",description:`Use this API to query the Customer 360 Audiences data lake across data model, lake, unified, and linked objects.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query.htm`,type:"data_cloud",method:"GET",path:"/api/v1/dataGraph/:dataGraphName/:dataGraphRecordId",bodyType:"raw",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Query",body:`{
    "data": [
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_018",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-26T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_002",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_014",
            "ssot__SoldToCustomerId__c": "A001"
        }
    ],
    "startTime": "2021-09-08T14:59:39.120024Z",
    "endTime": "2021-09-08T14:59:41.71155Z",
    "rowCount": 3,
    "queryId": "08be2ddc-4a1d-4a4b-8fa8-efce1acf1b83",
    "done": true,
    "metadata": {
        "ssot__PurchaseOrderDate__c": {
            "type": "TIMESTAMP",
            "placeInOrder": 3,
            "typeCode": 93
        },
        "ssot__InternalOrganizationId__c": {
            "type": "VARCHAR",
            "placeInOrder": 2,
            "typeCode": 12
        },
        "ssot__SoldToCustomerId__c": {
            "type": "VARCHAR",
            "placeInOrder": 5,
            "typeCode": 12
        },
        "ssot__DataSourceObjectId__c": {
            "type": "VARCHAR",
            "placeInOrder": 1,
            "typeCode": 12
        },
        "ssot__Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 4,
            "typeCode": 12
        },
        "ssot__DataSourceId__c": {
            "type": "VARCHAR",
            "placeInOrder": 0,
            "typeCode": 12
        }
    }
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:59:41 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"b45dd9fb4cdea33b4d058ec22f5a4027"},{name:"set-cookie",value:"JSESSIONID=node0xot6nlqxn7sg1v7bigttjamku376.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"2636"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Data Graph API/Query Data Graph Data Using Lookup Keys",name:"Query Data Graph Data Using Lookup Keys",folder:"Brobench/Data Cloud/Data Graph API",description:`Use this API to query the Customer 360 Audiences data lake across data model, lake, unified, and linked objects.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query.htm`,type:"data_cloud",method:"GET",path:"/api/v1/dataGraph/:dataGraphName?lookupKeys=[]",bodyType:"raw",body:"",headers:[],query:[{name:"lookupKeys",value:"[]"}],headerInfos:[],queryInfos:[{name:"lookupKeys",description:"The API name of the related object included in the data graph and a field name and field ID of that related object, limited to the individual ID field on a specific related data model object."}],responses:[{statusCode:200,name:"Query",body:`{
    "data": [
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_018",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-26T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_002",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_014",
            "ssot__SoldToCustomerId__c": "A001"
        }
    ],
    "startTime": "2021-09-08T14:59:39.120024Z",
    "endTime": "2021-09-08T14:59:41.71155Z",
    "rowCount": 3,
    "queryId": "08be2ddc-4a1d-4a4b-8fa8-efce1acf1b83",
    "done": true,
    "metadata": {
        "ssot__PurchaseOrderDate__c": {
            "type": "TIMESTAMP",
            "placeInOrder": 3,
            "typeCode": 93
        },
        "ssot__InternalOrganizationId__c": {
            "type": "VARCHAR",
            "placeInOrder": 2,
            "typeCode": 12
        },
        "ssot__SoldToCustomerId__c": {
            "type": "VARCHAR",
            "placeInOrder": 5,
            "typeCode": 12
        },
        "ssot__DataSourceObjectId__c": {
            "type": "VARCHAR",
            "placeInOrder": 1,
            "typeCode": 12
        },
        "ssot__Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 4,
            "typeCode": 12
        },
        "ssot__DataSourceId__c": {
            "type": "VARCHAR",
            "placeInOrder": 0,
            "typeCode": 12
        }
    }
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:59:41 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"b45dd9fb4cdea33b4d058ec22f5a4027"},{name:"set-cookie",value:"JSESSIONID=node0xot6nlqxn7sg1v7bigttjamku376.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"2636"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Query Unified Record ID/Query",name:"Query",folder:"Brobench/Data Cloud/Query Unified Record ID",description:`Use this API to query the Customer 360 Audiences data lake across data model, lake, unified, and linked objects.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_query.htm`,type:"data_cloud",method:"GET",path:"/api/v1/universalIdLookup/:entityName/:dataSourceId__c/:dataSourceObjectId__c/:sourceRecordId__c",bodyType:"raw",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Query",body:`{
    "data": [
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_018",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-26T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_002",
            "ssot__SoldToCustomerId__c": "A001"
        },
        {
            "ssot__DataSourceId__c": "POS",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061836_84278f03-3d5d-4c14-bedc-feca7bfbdfb2",
            "ssot__InternalOrganizationId__c": "",
            "ssot__PurchaseOrderDate__c": "2021-02-28T00:00:00.000+00:00",
            "ssot__Id__c": "InStore_014",
            "ssot__SoldToCustomerId__c": "A001"
        }
    ],
    "startTime": "2021-09-08T14:59:39.120024Z",
    "endTime": "2021-09-08T14:59:41.71155Z",
    "rowCount": 3,
    "queryId": "08be2ddc-4a1d-4a4b-8fa8-efce1acf1b83",
    "done": true,
    "metadata": {
        "ssot__PurchaseOrderDate__c": {
            "type": "TIMESTAMP",
            "placeInOrder": 3,
            "typeCode": 93
        },
        "ssot__InternalOrganizationId__c": {
            "type": "VARCHAR",
            "placeInOrder": 2,
            "typeCode": 12
        },
        "ssot__SoldToCustomerId__c": {
            "type": "VARCHAR",
            "placeInOrder": 5,
            "typeCode": 12
        },
        "ssot__DataSourceObjectId__c": {
            "type": "VARCHAR",
            "placeInOrder": 1,
            "typeCode": 12
        },
        "ssot__Id__c": {
            "type": "VARCHAR",
            "placeInOrder": 4,
            "typeCode": 12
        },
        "ssot__DataSourceId__c": {
            "type": "VARCHAR",
            "placeInOrder": 0,
            "typeCode": 12
        }
    }
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 14:59:41 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=FiJDoY3MMe/0LEIbd+TVmGoOkji/Mvcz+hdVhkB1/cX+QiW7HS+nmdbgdHb9R0DmoAnFUPtMsWjdfXDAOv9iqE+P27SUK+sy3cj67pBZ3ceULzny2MPXVL+6U0B/; Expires=Wed, 15 Sep 2021 14:59:39 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"b45dd9fb4cdea33b4d058ec22f5a4027"},{name:"set-cookie",value:"JSESSIONID=node0xot6nlqxn7sg1v7bigttjamku376.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"2636"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Streaming/Insert Records",name:"Insert Records",folder:"Brobench/Data Cloud/Ingestion API/Streaming",type:"data_cloud",method:"POST",path:"/api/v1/ingest/sources/Event_API/runner_profiles",bodyType:"raw",body:`{
    "data": [
        {
            "maid": 123,
            "first_name": "Sandeep",
            "last_name": "Aulakh",
            "email": "saulakh@salesforce-nto.com",
            "gender": "Male",
            "city": "Wilton",
            "state": "CT",
            "created": "2021-10-22T09:11:11.816319Z"
        },
        {
            "maid": 124,
            "first_name": "Aaron",
            "last_name": "Cates",
            "email": "acates@salesforce-nto.com",
            "gender": "Male",
            "city": "San Francisco",
            "state": "CA",
            "created": "2021-10-22T09:11:11.816319Z"
        }
    ]
}`,headers:[{name:"Content-Type",value:"application/json"}],query:[],headerInfos:[{name:"Content-Type"}],queryInfos:[],responses:[{statusCode:200,name:"Insert Records",body:`{
    "accepted": true
}`}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Streaming/Delete Records",name:"Delete Records",folder:"Brobench/Data Cloud/Ingestion API/Streaming",type:"data_cloud",method:"DELETE",path:"/api/v1/ingest/sources/Event_API/runner_profiles?ids=101",body:"",headers:[],query:[{name:"ids",value:"101"}],headerInfos:[],queryInfos:[{name:"ids"}],responses:[{statusCode:200,name:"Delete Records",body:`{
    "accepted": true
}`}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Streaming/Sync Record Validation",name:"Sync Record Validation",folder:"Brobench/Data Cloud/Ingestion API/Streaming",type:"data_cloud",method:"POST",path:"/api/v1/ingest/sources/Event_API/runner_profiles/actions/test",bodyType:"raw",body:`{
    "data": [
        {
            "maid": 101,
            "first_name": "Sandeep",
            "last_name": "Aulakh",
            "email": "saulakh@salesforce-nto.com",
            "gender": "Male",
            "city": "Wilton",
            "state": "CT",
            "created": "2021-10-22T09:11:11.816319Z"
        },
        {
            "maid": 102,
            "first_name": "Aaron",
            "last_name": "Cates",
            "email": "acates@salesforce-nto.com",
            "gender": "Male",
            "city": "San Francisco",
            "state": "CA",
            "created": "2021-10-22T09:11:11.816319Z"
        }
    ]
}`,headers:[{name:"Content-Type",value:"application/json"}],query:[],headerInfos:[{name:"Content-Type"}],queryInfos:[],responses:[{statusCode:200,name:"Sync Record Validation",body:`{
    "accepted": true
}`}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Bulk/Create Job",name:"Create Job",folder:"Brobench/Data Cloud/Ingestion API/Bulk",type:"data_cloud",method:"POST",path:"/api/v1/ingest/jobs",bodyType:"raw",body:`{
    "object": "runner_profiles",
    "sourceName": "Event_API",
    "operation": "upsert"
}`,headers:[{name:"Content-Type",value:"application/json"}],query:[],headerInfos:[{name:"Content-Type"}],queryInfos:[],responses:[{statusCode:200,name:"Create Job",body:`{
    "object": "runner_profiles",
    "id": "78f56f55-c00a-4e20-ab7d-03307a319ff2",
    "operation": "upsert",
    "sourceName": "Event_API",
    "createdById": "0053y00000FUGfBAAX",
    "createdDate": "2021-10-28T19:44:20.284675Z",
    "systemModstamp": "2021-10-28T19:44:20.284675Z",
    "state": "Open",
    "contentType": "CSV",
    "apiVersion": "v1",
    "contentUrl": "/api/v1/ingest/jobs/78f56f55-c00a-4e20-ab7d-03307a319ff2/batches"
}`}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Bulk/Upload Job",name:"Upload Job",folder:"Brobench/Data Cloud/Ingestion API/Bulk",type:"data_cloud",method:"PUT",path:"/api/v1/ingest/jobs/:jobId/batches",bodyType:"raw",body:`maid,first_name,last_name,email,gender,city,state,created
201,Sandeep_csv,Aulakh_csv,saulakh+ntodemo.com,M,NYC,NY,2021-10-22T09:11:11.816319Z
201,Sandeep_csv1,Aulakh_csv1,saulakh+ntodemo.com,M,NYC,NY,2021-11-22T09:11:11.816319Z
`,headers:[{name:"Content-Type",value:"text/csv"},{name:"Content-Length",value:"0"}],query:[],headerInfos:[{name:"Content-Type"},{name:"Content-Length"}],queryInfos:[],responses:[{statusCode:200,name:"Upload Job",body:`{
    "accepted": true
}`}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Bulk/Close Job",name:"Close Job",folder:"Brobench/Data Cloud/Ingestion API/Bulk",type:"data_cloud",method:"PATCH",path:"/api/v1/ingest/jobs/:jobId",bodyType:"raw",body:`{
   "state" : "UploadComplete"
}`,headers:[{name:"Content-Type",value:"application/json"}],query:[],headerInfos:[{name:"Content-Type"}],queryInfos:[],responses:[{statusCode:200,name:"Close Job",body:`{
    "object": "runner_profiles",
    "id": "b1b79aa2-b846-403a-b41f-d89932f0b2ae",
    "operation": "upsert",
    "sourceName": "Event_API",
    "createdById": "0053y00000FUGfBAAX",
    "createdDate": "2021-10-28T17:14:58.692891Z",
    "systemModstamp": "2021-10-28T19:41:02.292527Z",
    "state": "UploadComplete",
    "contentType": "CSV",
    "apiVersion": "v1"
}`}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Bulk/Abort Job",name:"Abort Job",folder:"Brobench/Data Cloud/Ingestion API/Bulk",type:"data_cloud",method:"PATCH",path:"/api/v1/ingest/jobs/:jobId",bodyType:"raw",body:`{
   "state" : "Aborted"
}`,headers:[{name:"Content-Type",value:"application/json"}],query:[],headerInfos:[{name:"Content-Type"}],queryInfos:[],responses:[{statusCode:200,name:"Abort Job",body:`{
    "object": "runner_profiles",
    "id": "e70934e8-2877-4660-872b-f3d9be4b9ad7",
    "operation": "upsert",
    "sourceName": "Event_API",
    "createdById": "0053y00000FUGfBAAX",
    "createdDate": "2021-10-28T19:41:47.419923Z",
    "systemModstamp": "2021-10-28T19:42:03.035256Z",
    "state": "Aborted",
    "contentType": "CSV",
    "apiVersion": "v1"
}`}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Bulk/Delete Job",name:"Delete Job",folder:"Brobench/Data Cloud/Ingestion API/Bulk",type:"data_cloud",method:"DELETE",path:"/api/v1/ingest/jobs/:jobId",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Delete Job",body:""}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Bulk/Get Job Info",name:"Get Job Info",folder:"Brobench/Data Cloud/Ingestion API/Bulk",type:"data_cloud",method:"GET",path:"/api/v1/ingest/jobs/:jobId",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Get Job Info",body:`{
    "object": "runner_profiles",
    "id": "b1b79aa2-b846-403a-b41f-d89932f0b2ae",
    "operation": "upsert",
    "sourceName": "Event_API",
    "createdById": "0053y00000FUGfBAAX",
    "createdDate": "2021-10-28T17:14:58.692891Z",
    "systemModstamp": "2021-10-28T17:14:58.692891Z",
    "state": "Open",
    "contentType": "CSV",
    "apiVersion": "v1",
    "contentUrl": "/api/v1/ingest/jobs/b1b79aa2-b846-403a-b41f-d89932f0b2ae/batches",
    "retries": 0,
    "totalProcessingTime": 0
}`}],source:"Standard"},{id:"Brobench/Data Cloud/Ingestion API/Bulk/Get All Jobs",name:"Get All Jobs",folder:"Brobench/Data Cloud/Ingestion API/Bulk",type:"data_cloud",method:"GET",path:"/api/v1/ingest/jobs?limit=50&offset=&orderby=&state=",body:"",headers:[],query:[{name:"limit",value:"50"},{name:"offset",value:""},{name:"orderby",value:""},{name:"state",value:""}],headerInfos:[],queryInfos:[{name:"limit"},{name:"offset"},{name:"orderby"},{name:"state"}],responses:[{statusCode:200,name:"Get All Jobs",body:`{
    "data": [
        {
            "object": "runner_profiles",
            "id": "b1b79aa2-b846-403a-b41f-d89932f0b2ae",
            "operation": "upsert",
            "sourceName": "Event_API",
            "createdById": "0053y00000FUGfBAAX",
            "createdDate": "2021-10-28T17:14:58.692891Z",
            "systemModstamp": "2021-10-28T17:14:58.692891Z",
            "state": "Open",
            "contentType": "CSV",
            "apiVersion": "v1",
            "contentUrl": "/api/v1/ingest/jobs/b1b79aa2-b846-403a-b41f-d89932f0b2ae/batches",
            "retries": 0,
            "totalProcessingTime": 0
        }
    ]
}`}],source:"Standard"},{id:"Brobench/Data Cloud/Profile API/Metadata",name:"Metadata",folder:"Brobench/Data Cloud/Profile API",description:`The metadata includes the dimension and measure that are part of the calculated insight.


https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_insights_meta_ci_name.htm`,type:"data_cloud",method:"GET",path:"/api/v1/profile/metadata",bodyType:"raw",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Metadata",body:`{
    "metadata": [
        {
            "fields": [
                {
                    "name": "IndividualId__c",
                    "displayName": "Individual Id",
                    "type": "STRING"
                },
                {
                    "name": "segment_1sg4W000000oLolQAE__c",
                    "displayName": "Segment 1sg4W000000oLolQAE",
                    "type": "NUMBER"
                },
                {
                    "name": "segment_1sg4W000000oLolQAE_lastprocessed__c",
                    "displayName": "1sg4W000000oLolQAE Last Processed",
                    "type": "DATE_TIME"
                },
                {
                    "name": "segment_1sg4W000000oLolQAE_name__c",
                    "displayName": "Segment 1sg4W000000oLolQAE Name",
                    "type": "STRING"
                }
            ],
            "indexes": [],
            "category": "Profile",
            "name": "activation_test__dlm",
            "displayName": "activation-test",
            "relationships": [
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "activation_test__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "IndividualId__c",
                    "cardinality": "ONETOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "IndividualId__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Individual Id",
                    "type": "STRING"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Individual Id",
                    "type": "STRING"
                },
                {
                    "name": "CreatedDate__c",
                    "displayName": "CreatedDate",
                    "type": "DATE_TIME"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "InternalOrganizationId",
                    "type": "STRING"
                }
            ],
            "indexes": [
                {
                    "fields": [
                        {
                            "name": "SourceRecordId__c",
                            "type": "STRING"
                        }
                    ]
                }
            ],
            "category": "Profile",
            "name": "IndividualIdentityLink__dlm",
            "displayName": "Individual Identity Link",
            "relationships": [
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "IndividualIdentityLink__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "IndividualIdentityLink__dlm",
                    "toEntity": "UnifiedIndividual__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING"
                },
                {
                    "name": "ssot__FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING"
                },
                {
                    "name": "ssot__LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING"
                }
            ],
            "indexes": [],
            "category": "Profile",
            "name": "ssot__Individual__dlm",
            "displayName": "Individual",
            "relationships": [
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "IndividualIdentityLink__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "activation_test__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "IndividualId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__EmailEngagement__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__IndividualId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__SoldToCustomerId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "ssot__FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING"
                },
                {
                    "name": "ssot__LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING"
                }
            ],
            "indexes": [
                {
                    "fields": [
                        {
                            "name": "ssot__FirstName__c",
                            "type": "STRING"
                        }
                    ]
                },
                {
                    "fields": [
                        {
                            "name": "ssot__LastName__c",
                            "type": "STRING"
                        }
                    ]
                },
                {
                    "fields": [
                        {
                            "name": "ssot__FirstName__c",
                            "type": "STRING"
                        },
                        {
                            "name": "ssot__LastName__c",
                            "type": "STRING"
                        }
                    ]
                }
            ],
            "category": "Profile",
            "name": "UnifiedIndividual__dlm",
            "displayName": "Unified Individual",
            "relationships": [
                {
                    "fromEntity": "UnifiedContactPointPhone__dlm",
                    "toEntity": "UnifiedIndividual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "IndividualIdentityLink__dlm",
                    "toEntity": "UnifiedIndividual__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedContactPointEmail__dlm",
                    "toEntity": "UnifiedIndividual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "CreatedDate__c",
                    "displayName": "CreatedDate",
                    "type": "DATE_TIME"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Email Id",
                    "type": "STRING"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Contact Point Email Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "InternalOrganizationId",
                    "type": "STRING"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ContactPointEmailIdentityLink__dlm",
            "displayName": "Contact Point Email Identity Link",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ContactPointEmailIdentityLink__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ContactPointEmailIdentityLink__dlm",
                    "toEntity": "UnifiedContactPointEmail__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Email Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "CreatedDate__c",
                    "displayName": "CreatedDate",
                    "type": "DATE_TIME"
                },
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Phone Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "InternalOrganizationId",
                    "type": "STRING"
                },
                {
                    "name": "UnifiedRecordId__c",
                    "displayName": "Unified Contact Point Phone Id",
                    "type": "STRING"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ContactPointPhoneIdentityLink__dlm",
            "displayName": "Contact Point Phone Identity Link",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ContactPointPhoneIdentityLink__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ContactPointPhoneIdentityLink__dlm",
                    "toEntity": "UnifiedContactPointPhone__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "SourceRecordId__c",
                    "displayName": "Contact Point Phone Id",
                    "indexOrder": "1"
                },
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "indexOrder": "2"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "indexOrder": "3"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING"
                },
                {
                    "name": "ssot__EmailAddress__c",
                    "displayName": "Email Address",
                    "type": "STRING"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Email Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ssot__ContactPointEmail__dlm",
            "displayName": "Contact Point Email",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ContactPointEmailIdentityLink__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Email Id",
                    "indexOrder": "1"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING"
                },
                {
                    "name": "ssot__FormattedE164PhoneNumber__c",
                    "displayName": "Formatted E164 Phone Number",
                    "type": "STRING"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Phone Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ssot__ContactPointPhone__dlm",
            "displayName": "Contact Point Phone",
            "relationships": [
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ContactPointPhoneIdentityLink__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Phone Id",
                    "indexOrder": "1"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Sales Order Product Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING"
                },
                {
                    "name": "ssot__OrderedQuantity__c",
                    "displayName": "Ordered Quantity",
                    "type": "NUMBER"
                },
                {
                    "name": "ssot__ProductId__c",
                    "displayName": "Product",
                    "type": "STRING"
                },
                {
                    "name": "ssot__SalesOrderId__c",
                    "displayName": "Sales Order",
                    "type": "STRING"
                },
                {
                    "name": "ssot__TotalPriceAmount__c",
                    "displayName": "Total Price Amount",
                    "type": "NUMBER"
                },
                {
                    "name": "ssot__UnitPriceAmount__c",
                    "displayName": "Unit Price Amount",
                    "type": "NUMBER"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "ssot__SalesOrderProduct__dlm",
            "displayName": "Sales Order Product",
            "relationships": [
                {
                    "fromEntity": "ssot__SalesOrderProduct__dlm",
                    "toEntity": "ssot__SalesOrder__dlm",
                    "fromEntityAttribute": "ssot__SalesOrderId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Sales Order Product Id",
                    "indexOrder": "1"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "ssot__EmailAddress__c",
                    "displayName": "Email Address",
                    "type": "STRING"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Email Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING"
                }
            ],
            "indexes": [
                {
                    "fields": [
                        {
                            "name": "ssot__EmailAddress__c",
                            "type": "STRING"
                        }
                    ]
                }
            ],
            "category": "Related",
            "name": "UnifiedContactPointEmail__dlm",
            "displayName": "Unified Contact Point Email",
            "relationships": [
                {
                    "fromEntity": "ContactPointEmailIdentityLink__dlm",
                    "toEntity": "UnifiedContactPointEmail__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedContactPointEmail__dlm",
                    "toEntity": "UnifiedIndividual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Email Id",
                    "indexOrder": "1"
                }
            ]
        },
        {
            "fields": [
                {
                    "name": "ssot__FormattedE164PhoneNumber__c",
                    "displayName": "Formatted E164 Phone Number",
                    "type": "STRING"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Phone Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING"
                },
                {
                    "name": "ssot__PartyId__c",
                    "displayName": "Party",
                    "type": "STRING"
                }
            ],
            "indexes": [],
            "category": "Related",
            "name": "UnifiedContactPointPhone__dlm",
            "displayName": "Unified Contact Point Phone",
            "relationships": [
                {
                    "fromEntity": "ContactPointPhoneIdentityLink__dlm",
                    "toEntity": "UnifiedContactPointPhone__dlm",
                    "fromEntityAttribute": "UnifiedRecordId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "UnifiedContactPointPhone__dlm",
                    "toEntity": "UnifiedIndividual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Contact Point Phone Id",
                    "indexOrder": "1"
                }
            ]
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 15:00:33 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=iXQDdWBzJcWLeOyf4N+93Ze2Zq5nAv4f1gDvkXoSNOLQpIxcqNRbfu0w8kBTUThS2xnRMa6fXZi/fJzjGQvp1k38leGNhyVKoj+7zqyDYj/4ID4JQHOb5rkZM+BS; Expires=Wed, 15 Sep 2021 15:00:32 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=iXQDdWBzJcWLeOyf4N+93Ze2Zq5nAv4f1gDvkXoSNOLQpIxcqNRbfu0w8kBTUThS2xnRMa6fXZi/fJzjGQvp1k38leGNhyVKoj+7zqyDYj/4ID4JQHOb5rkZM+BS; Expires=Wed, 15 Sep 2021 15:00:32 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"2eae87a13d80e94a5966f12622bf68a3"},{name:"set-cookie",value:"JSESSIONID=node098kyovct843018ebt0pdq0eez601.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"1000"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Profile API/Metadata - DMO",name:"Metadata - DMO",folder:"Brobench/Data Cloud/Profile API",description:`Returns the metadata for the data model object. Metadata includes the list of fields, data types and indexes available for lookup.

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_profile_meta_dmname.htm`,type:"data_cloud",method:"GET",path:"/api/v1/profile/metadata/:dmoApiName",bodyType:"raw",body:"",headers:[],query:[],headerInfos:[],queryInfos:[],responses:[{statusCode:200,name:"Metadata - DMO",body:`{
    "metadata": [
        {
            "relationships": [
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "IndividualIdentityLink__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "SourceRecordId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__Individual__dlm",
                    "toEntity": "activation_test__dlm",
                    "fromEntityAttribute": "ssot__Id__c",
                    "toEntityAttribute": "IndividualId__c",
                    "cardinality": "ONETOONE"
                },
                {
                    "fromEntity": "ssot__EmailEngagement__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__IndividualId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointEmail__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__SalesOrder__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__SoldToCustomerId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                },
                {
                    "fromEntity": "ssot__ContactPointPhone__dlm",
                    "toEntity": "ssot__Individual__dlm",
                    "fromEntityAttribute": "ssot__PartyId__c",
                    "toEntityAttribute": "ssot__Id__c",
                    "cardinality": "NTOONE"
                }
            ],
            "primaryKeys": [
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "indexOrder": "1"
                }
            ],
            "indexes": [
                {
                    "fields": [
                        {
                            "name": "ssot__Id__c",
                            "displayName": "Individual Id",
                            "type": "STRING"
                        }
                    ]
                }
            ],
            "displayName": "Individual",
            "name": "ssot__Individual__dlm",
            "fields": [
                {
                    "name": "ssot__DataSourceId__c",
                    "displayName": "Data Source",
                    "type": "STRING"
                },
                {
                    "name": "ssot__DataSourceObjectId__c",
                    "displayName": "Data Source Object",
                    "type": "STRING"
                },
                {
                    "name": "ssot__FirstName__c",
                    "displayName": "First Name",
                    "type": "STRING"
                },
                {
                    "name": "ssot__Id__c",
                    "displayName": "Individual Id",
                    "type": "STRING"
                },
                {
                    "name": "ssot__InternalOrganizationId__c",
                    "displayName": "Internal Organization",
                    "type": "STRING"
                },
                {
                    "name": "ssot__LastName__c",
                    "displayName": "Last Name",
                    "type": "STRING"
                }
            ],
            "category": "Profile"
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 18:50:24 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=lgacwGS0FdOw2cnuY7+qFsD/TOUgh3YImeNe8DQPwZv/YdzouIAsm0aXi39nGFl9atYfqd7VYuHVAgOSbSruXyeHsuZqA9DLWQ6lMQU6kV6Igi2dc8xgorzs+YZD; Expires=Wed, 15 Sep 2021 18:50:24 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=lgacwGS0FdOw2cnuY7+qFsD/TOUgh3YImeNe8DQPwZv/YdzouIAsm0aXi39nGFl9atYfqd7VYuHVAgOSbSruXyeHsuZqA9DLWQ6lMQU6kV6Igi2dc8xgorzs+YZD; Expires=Wed, 15 Sep 2021 18:50:24 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"906757d457e830d2d456f99ffb098a4f"},{name:"set-cookie",value:"JSESSIONID=node01ces36td28ffy1us2h11fgoiuk578.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"241"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Profile API/DMO",name:"DMO",folder:"Brobench/Data Cloud/Profile API",description:`Returns data model objects based on search filters. Use this API call to retrieve the object records after applying the selected filter(s).

https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_profile_dmname.htm`,type:"data_cloud",method:"GET",path:"/api/v1/profile/:dmoApiName?fields=ssot__Id__c,ssot__FirstName__c,ssot__LastName__c,ssot__DataSourceId__c&limit=100&filters=[ssot__DataSourceId__c=POS]",bodyType:"raw",body:"",headers:[],query:[{name:"fields",value:"ssot__Id__c,ssot__FirstName__c,ssot__LastName__c,ssot__DataSourceId__c"},{name:"limit",value:"100"},{name:"filters",value:"[ssot__DataSourceId__c=POS]"}],headerInfos:[],queryInfos:[{name:"fields"},{name:"limit"},{name:"filters"}],responses:[{statusCode:200,name:"DMO",body:`{
    "data": [
        {
            "ssot__Id__c": "A028",
            "ssot__FirstName__c": "Van",
            "ssot__LastName__c": "Emery",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A042",
            "ssot__FirstName__c": "Williams",
            "ssot__LastName__c": "Albano",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A012",
            "ssot__FirstName__c": "Terrilyn",
            "ssot__LastName__c": "Tubb",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A014",
            "ssot__FirstName__c": "Vivian",
            "ssot__LastName__c": "Mccallie",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A031",
            "ssot__FirstName__c": "Jessie",
            "ssot__LastName__c": "Depuy",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A037",
            "ssot__FirstName__c": "Juliana",
            "ssot__LastName__c": "Haralson",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A049",
            "ssot__FirstName__c": "Enrique",
            "ssot__LastName__c": "Marcum",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A016",
            "ssot__FirstName__c": "Angelika",
            "ssot__LastName__c": "Paulette",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A030",
            "ssot__FirstName__c": "Narcisa",
            "ssot__LastName__c": "Hogans",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A002",
            "ssot__FirstName__c": "Shawn",
            "ssot__LastName__c": "Hannah",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A022",
            "ssot__FirstName__c": "Florence",
            "ssot__LastName__c": "Galbraith",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A025",
            "ssot__FirstName__c": "Meghan",
            "ssot__LastName__c": "Jeter",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A007",
            "ssot__FirstName__c": "Deetta",
            "ssot__LastName__c": "Claussen",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A018",
            "ssot__FirstName__c": "Hilde",
            "ssot__LastName__c": "Fan",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A035",
            "ssot__FirstName__c": "Wanda",
            "ssot__LastName__c": "Gilman",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A003",
            "ssot__FirstName__c": "Tressa",
            "ssot__LastName__c": "Denmon",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A039",
            "ssot__FirstName__c": "Nelson",
            "ssot__LastName__c": "Aceto",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A005",
            "ssot__FirstName__c": "Floy",
            "ssot__LastName__c": "Rice",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A001",
            "ssot__FirstName__c": "Everett",
            "ssot__LastName__c": "Lagrange",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A006",
            "ssot__FirstName__c": "Morton",
            "ssot__LastName__c": "Vanetten",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A011",
            "ssot__FirstName__c": "Jonnie",
            "ssot__LastName__c": "Auger",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A027",
            "ssot__FirstName__c": "Grace",
            "ssot__LastName__c": "Brame",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A019",
            "ssot__FirstName__c": "Karrie",
            "ssot__LastName__c": "Christon",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A036",
            "ssot__FirstName__c": "Jesenia",
            "ssot__LastName__c": "Mouton",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A043",
            "ssot__FirstName__c": "Kasha",
            "ssot__LastName__c": "Hove",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A050",
            "ssot__FirstName__c": "Francoise",
            "ssot__LastName__c": "Harrington",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A010",
            "ssot__FirstName__c": "Belinda",
            "ssot__LastName__c": "Westhoff",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A033",
            "ssot__FirstName__c": "Reina",
            "ssot__LastName__c": "Turnbull",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A034",
            "ssot__FirstName__c": "Diane",
            "ssot__LastName__c": "Rhoden",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A046",
            "ssot__FirstName__c": "Julissa",
            "ssot__LastName__c": "Gutierres",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A009",
            "ssot__FirstName__c": "Yuk",
            "ssot__LastName__c": "Coy",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A032",
            "ssot__FirstName__c": "Fonda",
            "ssot__LastName__c": "Auton",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A047",
            "ssot__FirstName__c": "Wei",
            "ssot__LastName__c": "Seevers",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A029",
            "ssot__FirstName__c": "Sona",
            "ssot__LastName__c": "Buchheit",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A038",
            "ssot__FirstName__c": "Erasmo",
            "ssot__LastName__c": "Morgado",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A048",
            "ssot__FirstName__c": "Tricia",
            "ssot__LastName__c": "Piller",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A021",
            "ssot__FirstName__c": "Donn",
            "ssot__LastName__c": "Hargrave",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A024",
            "ssot__FirstName__c": "Tonette",
            "ssot__LastName__c": "Sturrock",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A040",
            "ssot__FirstName__c": "Elsy",
            "ssot__LastName__c": "Vanalstyne",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A004",
            "ssot__FirstName__c": "Tatum",
            "ssot__LastName__c": "Vaccaro",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A017",
            "ssot__FirstName__c": "Alena",
            "ssot__LastName__c": "Bybee",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A045",
            "ssot__FirstName__c": "Joline",
            "ssot__LastName__c": "Tansey",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A015",
            "ssot__FirstName__c": "Albert",
            "ssot__LastName__c": "Castenada",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A023",
            "ssot__FirstName__c": "Clarita",
            "ssot__LastName__c": "Espinosa",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A020",
            "ssot__FirstName__c": "Tara",
            "ssot__LastName__c": "Lemmond",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A026",
            "ssot__FirstName__c": "Florine",
            "ssot__LastName__c": "Mccord",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A041",
            "ssot__FirstName__c": "Florencia",
            "ssot__LastName__c": "Dale",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A008",
            "ssot__FirstName__c": "Marlin",
            "ssot__LastName__c": "Winslett",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A013",
            "ssot__FirstName__c": "Valrie",
            "ssot__LastName__c": "Hutchings",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__Id__c": "A044",
            "ssot__FirstName__c": "Leone",
            "ssot__LastName__c": "Fearn",
            "ssot__DataSourceId__c": "POS"
        }
    ],
    "done": true
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 18:51:14 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=JoiOGW09LATojT0lvZIZopUW+doZ1vqB7yjgrOJ+f6tgkd5zU3LuIQwmYjVXDO6ep2Synm2bY1z3Tb/PGECIiEtJsiKrBqtoa98r4695bO0ivj9ZTwtWW0V+NPyT; Expires=Wed, 15 Sep 2021 18:51:11 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=JoiOGW09LATojT0lvZIZopUW+doZ1vqB7yjgrOJ+f6tgkd5zU3LuIQwmYjVXDO6ep2Synm2bY1z3Tb/PGECIiEtJsiKrBqtoa98r4695bO0ivj9ZTwtWW0V+NPyT; Expires=Wed, 15 Sep 2021 18:51:11 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"ecfc4e999362a90a39a4bc9c728708f7"},{name:"set-cookie",value:"JSESSIONID=node01mhf6gp8otj0x7b3prh7atkke929.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"3025"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Profile API/DMO - By ID",name:"DMO - By ID",folder:"Brobench/Data Cloud/Profile API",description:`Returns data model objects based on search indexes and filters. Use this API call to retrieve the object record based on the primary key or secondary keys. Returns an empty list when records are not found.


https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_profile_dmname_id.htm`,type:"data_cloud",method:"GET",path:"/api/v1/profile/:dmoApiName/:dmoRecordId?fields=ssot__Id__c,ssot__FirstName__c,ssot__LastName__c,ssot__DataSourceId__c&limit=100&filters=[ssot__DataSourceId__c=POS]",bodyType:"raw",body:"",headers:[],query:[{name:"fields",value:"ssot__Id__c,ssot__FirstName__c,ssot__LastName__c,ssot__DataSourceId__c"},{name:"limit",value:"100"},{name:"filters",value:"[ssot__DataSourceId__c=POS]"}],headerInfos:[],queryInfos:[{name:"fields"},{name:"limit"},{name:"filters"}],responses:[{statusCode:200,name:"DMO - By ID",body:`{
    "data": [
        {
            "ssot__Id__c": "A031",
            "ssot__FirstName__c": "Jessie",
            "ssot__LastName__c": "Depuy",
            "ssot__DataSourceId__c": "POS"
        }
    ],
    "done": true
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 18:51:53 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=GhMO6d3JIct/gnMzFaBSlGJS9Din/SDNwQPEApPZaC3SspUGocuX/i6b6ZOmCWIshSxt6JH0htjWdzyY3hJmqcGIe8/2oAkqbbZnJPy8GmLyaWwBYMTLaukJVDn2; Expires=Wed, 15 Sep 2021 18:51:53 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=GhMO6d3JIct/gnMzFaBSlGJS9Din/SDNwQPEApPZaC3SspUGocuX/i6b6ZOmCWIshSxt6JH0htjWdzyY3hJmqcGIe8/2oAkqbbZnJPy8GmLyaWwBYMTLaukJVDn2; Expires=Wed, 15 Sep 2021 18:51:53 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"8cf9264af748411a98d48f3b35272605"},{name:"set-cookie",value:"JSESSIONID=node011m6h117ito58ppn83s1a4ds7597.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"798"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Profile API/DMO - By Search Key",name:"DMO - By Search Key",folder:"Brobench/Data Cloud/Profile API",description:`Returns data model objects based on search indexes and filters. Use this API call to retrieve the object record based on the primary key or secondary keys. Returns an empty list when records are not found.


https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_profile_dmname_id.htm`,type:"data_cloud",method:"GET",path:"/api/v1/profile/:dmoApiName/:searchKey?searchKey=ssot__DataSourceId__c&fields=ssot__Id__c,ssot__FirstName__c,ssot__LastName__c,ssot__DataSourceId__c&limit=100&filters=[ssot__FirstName__c=Meghan]",bodyType:"raw",body:"",headers:[],query:[{name:"searchKey",value:"ssot__DataSourceId__c"},{name:"fields",value:"ssot__Id__c,ssot__FirstName__c,ssot__LastName__c,ssot__DataSourceId__c"},{name:"limit",value:"100"},{name:"filters",value:"[ssot__FirstName__c=Meghan]"}],headerInfos:[],queryInfos:[{name:"searchKey"},{name:"fields"},{name:"limit"},{name:"filters"}],responses:[{statusCode:200,name:"DMO - By Search Key",body:`{
    "data": [
        {
            "ssot__Id__c": "A025",
            "ssot__FirstName__c": "Meghan",
            "ssot__LastName__c": "Jeter",
            "ssot__DataSourceId__c": "POS"
        }
    ],
    "done": true
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 18:52:26 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=0pWObKs+VFpOPosmADg5DztshRr1oL09lTwxdPCkfZRDynSD5vJTKN5D/E82tMIsVsrzsxpGFH9B2sPMnVsg0/P94DLN8bvqLnjPV8eHcFACNTTWNCT9d64xp4J2; Expires=Wed, 15 Sep 2021 18:52:25 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=0pWObKs+VFpOPosmADg5DztshRr1oL09lTwxdPCkfZRDynSD5vJTKN5D/E82tMIsVsrzsxpGFH9B2sPMnVsg0/P94DLN8bvqLnjPV8eHcFACNTTWNCT9d64xp4J2; Expires=Wed, 15 Sep 2021 18:52:25 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"abe7a0cc69065adac8bf725ef28baeaf"},{name:"set-cookie",value:"JSESSIONID=node06hadrp9ey19d1vm108qv3duh3930.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"709"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Profile API/DMO and Children - By ID",name:"DMO and Children - By ID",folder:"Brobench/Data Cloud/Profile API",description:`Returns data model objects and child objects based on indexes and search filters.


https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_profile_dmname_id_child_dmname.htm`,type:"data_cloud",method:"GET",path:"/api/v1/profile/:dmoParentApiName/:dmoParentRecordId/:dmoChildApiName?fields=ssot__PartyId__c,ssot__EmailAddress__c&limit=10",bodyType:"raw",body:"",headers:[],query:[{name:"fields",value:"ssot__PartyId__c,ssot__EmailAddress__c"},{name:"limit",value:"10"}],headerInfos:[],queryInfos:[{name:"fields"},{name:"limit"}],responses:[{statusCode:200,name:"DMO and Children - By ID",body:`{
    "data": [
        {
            "ssot__LastName__c": "1e0403e9-7a82-3a5a-90f7-00c92ef8d5b2",
            "UnifiedContactPointEmail__dlm": {
                "ssot__PartyId__c": "1e0403e9-7a82-3a5a-90f7-00c92ef8d5b2",
                "ssot__EmailAddress__c": "FGalbraith@example.cdp"
            },
            "ssot__FirstName__c": "",
            "ssot__InternalOrganizationId__c": "Galbraith",
            "ssot__Id__c": "Florence"
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 18:53:10 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=9LbEqpeIACs7zBpMPK70r7tq6z5vaRC4+gMPx6PnssnwLCRFMwWPgGb3zjjIllN7b3/6pnFIWGKhoOFMabxdx4g1MXLB0vScZjhwN0FIoMmypgMd1T/7+yRzsMvd; Expires=Wed, 15 Sep 2021 18:53:10 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=9LbEqpeIACs7zBpMPK70r7tq6z5vaRC4+gMPx6PnssnwLCRFMwWPgGb3zjjIllN7b3/6pnFIWGKhoOFMabxdx4g1MXLB0vScZjhwN0FIoMmypgMd1T/7+yRzsMvd; Expires=Wed, 15 Sep 2021 18:53:10 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"c7a9e9f7f8f303f1741b69647dc92fe0"},{name:"set-cookie",value:"JSESSIONID=node0li4lnny8tevu7piml7sjwxy934.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"213"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Profile API/DMO and Children - By Search Key",name:"DMO and Children - By Search Key",folder:"Brobench/Data Cloud/Profile API",description:`Returns data model objects and child objects based on indexes and search filters.


https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_profile_dmname_id_child_dmname.htm`,type:"data_cloud",method:"GET",path:"/api/v1/profile/:dmoParentApiName/:searchKey/:dmoChildApiName?searchKey=ssot__LastName__c&fields=ssot__PartyId__c,ssot__EmailAddress__c&limit=10",bodyType:"raw",body:"",headers:[],query:[{name:"searchKey",value:"ssot__LastName__c"},{name:"fields",value:"ssot__PartyId__c,ssot__EmailAddress__c"},{name:"limit",value:"10"}],headerInfos:[],queryInfos:[{name:"searchKey"},{name:"fields"},{name:"limit"}],responses:[{statusCode:200,name:"DMO and Children - By Search Key",body:`{
    "data": [
        {
            "ssot__LastName__c": "790cf3ad-b959-337f-bbe9-e97398b0b7e3",
            "UnifiedContactPointEmail__dlm": {
                "ssot__PartyId__c": "790cf3ad-b959-337f-bbe9-e97398b0b7e3",
                "ssot__EmailAddress__c": "FRice@example.cdp"
            },
            "ssot__FirstName__c": "",
            "ssot__InternalOrganizationId__c": "Rice",
            "ssot__Id__c": "Floy"
        }
    ]
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 18:54:32 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=fBaJpJMIDQN466p5DumI1Gdrb9PXqDBH5YteRJJJzXFbEC/P8hW5c6R+twpfBC0MvWgvy/jJgBeoAkAMeXHf2QeYnY5237H02IiLaMTJctATHiesvPJmR2izahz+; Expires=Wed, 15 Sep 2021 18:54:31 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=fBaJpJMIDQN466p5DumI1Gdrb9PXqDBH5YteRJJJzXFbEC/P8hW5c6R+twpfBC0MvWgvy/jJgBeoAkAMeXHf2QeYnY5237H02IiLaMTJctATHiesvPJmR2izahz+; Expires=Wed, 15 Sep 2021 18:54:31 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"3a31045b7bb4598909092cebded14d45"},{name:"set-cookie",value:"JSESSIONID=node0hlqqu60to15m189s3dlj384sl583.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"278"},{name:"server",value:"istio-envoy"}]}],source:"Standard"},{id:"Brobench/Data Cloud/Profile API/DMO and Calculated Insight - By ID",name:"DMO and Calculated Insight - By ID",folder:"Brobench/Data Cloud/Profile API",description:`Returns data model objects and a computed view based on indexes and search filters.


https://developer.salesforce.com/docs/atlas.en-us.c360a_api.meta/c360a_api/c360a_api_profile_dmname_id_ci_ci_name.htm`,type:"data_cloud",method:"GET",path:"/api/v1/profile/:dmoApiName/:dmoRecordId/calculated-insights/:insightName?batchSize=5&dimensions=PurchaseDay__c,CustomerId__c&measures=TotalOrders__c&filters=[ssot__DataSourceId__c=POS]",bodyType:"raw",body:"",headers:[],query:[{name:"batchSize",value:"5"},{name:"dimensions",value:"PurchaseDay__c,CustomerId__c"},{name:"measures",value:"TotalOrders__c"},{name:"filters",value:"[ssot__DataSourceId__c=POS]"}],headerInfos:[],queryInfos:[{name:"batchSize"},{name:"dimensions"},{name:"measures"},{name:"filters"}],responses:[{statusCode:200,name:"DMO and Calculated Insight - By ID",body:`{
    "data": [
        {
            "ssot__LastName__c": "Lagrange",
            "PurchaseByDate__cio": {
                "CustomerId__c": "A001",
                "TotalOrders__c": 2,
                "PurchaseDay__c": "28"
            },
            "ssot__FirstName__c": "Everett",
            "ssot__InternalOrganizationId__c": "",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061643_1f325856-06a0-45c3-afba-5b3c10046731",
            "ssot__Id__c": "A001",
            "ssot__DataSourceId__c": "POS"
        },
        {
            "ssot__LastName__c": "Lagrange",
            "PurchaseByDate__cio": {
                "CustomerId__c": "A001",
                "TotalOrders__c": 1,
                "PurchaseDay__c": "26"
            },
            "ssot__FirstName__c": "Everett",
            "ssot__InternalOrganizationId__c": "",
            "ssot__DataSourceObjectId__c": "storage_direct_20210310-061643_1f325856-06a0-45c3-afba-5b3c10046731",
            "ssot__Id__c": "A001",
            "ssot__DataSourceId__c": "POS"
        }
    ],
    "done": true
}`,headers:[{name:"Date",value:"Wed, 08 Sep 2021 18:56:09 GMT"},{name:"Content-Type",value:"application/json"},{name:"Transfer-Encoding",value:"chunked"},{name:"Connection",value:"keep-alive"},{name:"Set-Cookie",value:"AWSALB=ATzUWJ2YistOJUQuzgflAwRp7mDGncWy9gKrz68WimAusoqY5by4DYkT1BEBN9rYRiwJvIu4/J8GZcIrp8NRcRef9vXNBt8BwNmf43DIm+/+1FVivQzPZX7dDmp9; Expires=Wed, 15 Sep 2021 18:56:06 GMT; Path=/"},{name:"Set-Cookie",value:"AWSALBCORS=ATzUWJ2YistOJUQuzgflAwRp7mDGncWy9gKrz68WimAusoqY5by4DYkT1BEBN9rYRiwJvIu4/J8GZcIrp8NRcRef9vXNBt8BwNmf43DIm+/+1FVivQzPZX7dDmp9; Expires=Wed, 15 Sep 2021 18:56:06 GMT; Path=/; SameSite=None; Secure"},{name:"x-trace-id",value:"300262699136a9f13c023dc5fc4a8e10"},{name:"set-cookie",value:"JSESSIONID=node0dhqk643kisuxihxeiw5d6w3x584.node0; Path=/query/v1; Secure"},{name:"expires",value:"Thu, 01 Jan 1970 00:00:00 GMT"},{name:"vary",value:"Accept-Encoding, User-Agent"},{name:"content-encoding",value:"gzip"},{name:"x-envoy-upstream-service-time",value:"2770"},{name:"server",value:"istio-envoy"}]}],source:"Standard"}]};export{n as stdApiRegistryDataCloud};
